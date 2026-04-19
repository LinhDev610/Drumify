# 🏗️ Hướng dẫn thêm Feature mới

Mỗi feature mới đi qua 7 bước. Ví dụ: feature **Job Listing**.

---

## Bước 1: Domain — Entity

```dart
// lib/domain/entities/job.dart
class Job {
  final String id;
  final String title;
  final String company;
  final double salary;
  final DateTime postedAt;

  const Job({...});

  bool get isNew => DateTime.now().difference(postedAt).inDays < 3;
  String get formattedSalary => StringUtils.formatVnd(salary);
}
```

## Bước 2: Domain — Repository Interface

```dart
// lib/domain/repositories/job_repository.dart
abstract class JobRepository {
  Future<Either<Failure, List<Job>>> getJobs({int page = 1});
  Future<Either<Failure, Job>> getJobDetail(String id);
  Future<Either<Failure, Unit>> applyJob(String jobId);
}
```

## Bước 3: Domain — UseCase

```dart
// lib/domain/usecases/job/get_jobs_usecase.dart
@injectable
class GetJobsUseCase {
  final JobRepository _repo;
  GetJobsUseCase(this._repo);

  Future<Either<Failure, List<Job>>> call({int page = 1}) =>
      _repo.getJobs(page: page);
}
```

## Bước 4: Data — Model

```dart
// lib/data/models/job/job_model.dart
@freezed
class JobModel with _$JobModel {
  const factory JobModel({
    required String id,
    required String title,
    required String company,
    required double salary,
    @JsonKey(name: 'posted_at') required String postedAt,
  }) = _JobModel;

  factory JobModel.fromJson(Map<String, dynamic> json) =>
      _$JobModelFromJson(json);

  // Chạy: flutter pub run build_runner build
}

// Extension để convert sang Entity
extension JobModelX on JobModel {
  Job toEntity() => Job(
    id: id,
    title: title,
    company: company,
    salary: salary,
    postedAt: DateTime.parse(postedAt),
  );
}
```

## Bước 5: Data — DataSource

```dart
// lib/data/datasources/remote/job_remote_datasource.dart
abstract class JobRemoteDataSource {
  Future<List<JobModel>> getJobs({int page = 1});
}

@LazySingleton(as: JobRemoteDataSource)
class JobRemoteDataSourceImpl implements JobRemoteDataSource {
  final DioClient _client;
  JobRemoteDataSourceImpl(this._client);

  @override
  Future<List<JobModel>> getJobs({int page = 1}) async {
    try {
      final res = await _client.dio.get('/jobs', queryParameters: {'page': page});
      final list = res.data['data'] as List;
      return list.map((e) => JobModel.fromJson(e)).toList();
    } on ServerException {
      rethrow;
    }
  }
}
```

## Bước 6: Data — Repository Impl

```dart
// lib/data/repositories/job_repository_impl.dart
@LazySingleton(as: JobRepository)
class JobRepositoryImpl implements JobRepository {
  final JobRemoteDataSource _remote;
  JobRepositoryImpl(this._remote);

  @override
  Future<Either<Failure, List<Job>>> getJobs({int page = 1}) async {
    try {
      final models = await _remote.getJobs(page: page);
      return Right(models.map((m) => m.toEntity()).toList());
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message ?? 'Lỗi tải danh sách'));
    } on NetworkException {
      return const Left(NetworkFailure());
    }
  }
}
```

## Bước 7: Presentation — BLoC + Page

```dart
// lib/presentation/features/jobs/bloc/jobs_bloc.dart
@injectable
class JobsBloc extends Bloc<JobsEvent, JobsState> {
  final GetJobsUseCase _getJobs;
  JobsBloc(this._getJobs) : super(const JobsState.initial()) {
    on<LoadJobsEvent>(_onLoad);
  }

  Future<void> _onLoad(LoadJobsEvent e, Emitter emit) async {
    emit(const JobsState.loading());
    final result = await _getJobs();
    result.fold(
      (f) => emit(JobsState.error(f.message)),
      (jobs) => emit(JobsState.loaded(jobs)),
    );
  }
}

// lib/presentation/features/jobs/pages/jobs_page.dart
class JobsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<JobsBloc>()..add(const LoadJobsEvent()),
      child: const JobsView(),
    );
  }
}
```

---

## ✅ Checklist khi tạo feature mới

- [ ] Entity trong `domain/entities/`
- [ ] Repository interface trong `domain/repositories/`
- [ ] UseCase trong `domain/usecases/<feature>/`
- [ ] Model trong `data/models/<feature>/` với `@freezed`
- [ ] Remote DataSource + Impl
- [ ] (Optional) Local DataSource nếu cần cache
- [ ] Repository Impl trong `data/repositories/`
- [ ] BLoC/Event/State trong `presentation/features/<feature>/bloc/`
- [ ] Page trong `presentation/features/<feature>/pages/`
- [ ] Route trong `core/router/app_router.dart`
- [ ] Thêm key l10n vào ARB files nếu cần
- [ ] Chạy `flutter pub run build_runner build --delete-conflicting-outputs`

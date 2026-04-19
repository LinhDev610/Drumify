# 📁 Cấu trúc thư mục — Flutter Base Project

```
lib/
├── main.dart                          # Entry point: DI init + MaterialApp
│
├── core/                              # Hạ tầng dùng chung — mọi feature đều dùng
│   ├── di/
│   │   ├── injection.dart             # get_it + injectable bootstrap
│   │   └── injection.config.dart      # (generated) dependency graph
│   │
│   ├── network/
│   │   ├── dio_client.dart            # Dio factory: base URL + timeout + interceptors
│   │   ├── auth_interceptor.dart      # Attach Bearer token + auto-refresh on 401
│   │   └── error_interceptor.dart     # DioException → ServerException chuẩn hóa
│   │
│   ├── storage/
│   │   └── secure_storage.dart        # flutter_secure_storage: lưu token/sensitive data
│   │
│   ├── errors/
│   │   ├── exceptions.dart            # Data layer: ServerException, CacheException
│   │   └── failures.dart              # Domain/Presentation: Failure hierarchy
│   │
│   ├── theme/                         # ✨ Design System
│   │   ├── app_colors.dart            # Bảng màu toàn app (brand, neutral, status)
│   │   ├── app_text_styles.dart       # Typography scale (Inter font)
│   │   └── app_theme.dart             # ThemeData light + dark + spacing/radius constants
│   │
│   ├── utils/                         # Utilities & Helpers
│   │   ├── date_time_utils.dart       # Format, parse, relative time, so sánh ngày
│   │   ├── string_utils.dart          # Validate, format, mask, truncate chuỗi
│   │   └── validators.dart            # Form validators (email, phone, password…)
│   │
│   ├── debug/
│   │   └── api_logger.dart            # AppLogger + ApiDebugInterceptor (debug only)
│   │
│   ├── l10n/
│   │   └── l10n.dart                  # Extension context.l10n shorthand
│   │
│   └── router/
│       └── app_router.dart            # GoRouter setup + route definitions
│
├── l10n/                              # ARB localization files
│   ├── app_vi.arb                     # Tiếng Việt (template)
│   └── app_en.arb                     # English
│
├── data/                              # Data layer — implement Domain contracts
│   ├── models/
│   │   └── <feature>/
│   │       └── <name>_model.dart      # @freezed + fromJson/toJson + toEntity()
│   ├── datasources/
│   │   ├── remote/
│   │   │   └── <name>_remote_datasource.dart
│   │   └── local/
│   │       └── <name>_local_datasource.dart
│   └── repositories/
│       └── <name>_repository_impl.dart   # cache-then-network + Exception→Failure
│
├── domain/                            # Domain layer — pure Dart, zero dependencies
│   ├── entities/
│   │   └── <name>.dart               # Business object với computed properties
│   ├── repositories/
│   │   └── <name>_repository.dart    # Abstract interface (contract)
│   └── usecases/
│       └── <feature>/
│           └── <action>_usecase.dart  # 1 use case = 1 business action
│
└── presentation/                      # Presentation layer — UI + BLoC
    └── features/
        └── <feature>/
            ├── bloc/
            │   ├── <feature>_bloc.dart
            │   ├── <feature>_event.dart
            │   └── <feature>_state.dart   # @freezed
            ├── pages/
            │   └── <feature>_page.dart    # BlocProvider + route target
            └── widgets/
                └── *.dart                 # Reusable widgets cho feature này
```

## Quy tắc import

| Từ layer | Được import |
|----------|-------------|
| Domain | ❌ Không import gì (chỉ Dart core) |
| Data | ✅ Domain (entity, repo interface, failure) |
| Presentation | ✅ Domain (entity, usecase, failure) |
| Core | ✅ Được import bởi mọi layer |

## Naming Conventions

| Loại | Pattern | Ví dụ |
|------|---------|-------|
| Model | `<Name>Model` | `UserModel` |
| Entity | `<Name>` | `User` |
| Repository (abstract) | `<Name>Repository` | `UserRepository` |
| Repository (impl) | `<Name>RepositoryImpl` | `UserRepositoryImpl` |
| DataSource (abstract) | `<Name>RemoteDataSource` | `UserRemoteDataSource` |
| DataSource (impl) | `<Name>RemoteDataSourceImpl` | `UserRemoteDataSourceImpl` |
| UseCase | `<Action><Name>UseCase` | `GetUserUseCase` |
| BLoC | `<Feature>Bloc` | `ProfileBloc` |
| State | `<Feature>State` | `ProfileState` |
| Event | `<Feature>Event` | `ProfileEvent` |
| Page | `<Feature>Page` | `ProfilePage` |

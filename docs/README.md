# 🐦 JobShare — Flutter Base Project

## Kiến trúc: Clean Architecture · Layer-first · Repository Pattern · BLoC

---

## 📚 Tài liệu

| File | Nội dung |
|------|---------|
| [01_folder_structure.md](./01_folder_structure.md) | Cấu trúc thư mục, naming conventions, quy tắc import |
| [02_design_system.md](./02_design_system.md) | AppColors, AppTextStyles, AppTheme, spacing/radius |
| [03_utilities.md](./03_utilities.md) | DateTimeUtils, StringUtils, Validators, AppLogger |
| [04_secure_storage.md](./04_secure_storage.md) | SecureStorage, token management, token refresh flow |
| [05_localization.md](./05_localization.md) | ARB files, gen-l10n, cách thêm key mới |
| [06_adding_new_feature.md](./06_adding_new_feature.md) | Checklist và template code cho feature mới |

---

## 🏗️ Các thành phần đã có

### Core
- ✅ `core/errors/` — Exception & Failure hierarchy
- ✅ `core/network/` — DioClient + AuthInterceptor + ErrorInterceptor
- ✅ `core/storage/` — SecureStorage (Keychain/Keystore)
- ✅ `core/theme/` — AppColors, AppTextStyles, AppTheme (light + dark)
- ✅ `core/utils/` — DateTimeUtils, StringUtils, Validators
- ✅ `core/debug/` — AppLogger + ApiDebugInterceptor
- ✅ `core/l10n/` — Extension `context.l10n`
- ✅ `core/di/` — injection.dart (get_it + injectable)
- ✅ `core/router/` — AppRouter (go_router)

### Localization
- ✅ `l10n/app_vi.arb` — Tiếng Việt (template, ~40 keys)
- ✅ `l10n/app_en.arb` — English

---

## ⚡ Commands

```bash
# Lần đầu setup
flutter pub get
flutter gen-l10n

# Sau khi thêm @freezed model hoặc @injectable
flutter pub run build_runner build --delete-conflicting-outputs

# Chạy app
flutter run

# Watch mode (tự rebuild khi save)
flutter pub run build_runner watch --delete-conflicting-outputs
```

---

## 📦 Tech Stack

| Package | Version | Vai trò |
|---------|---------|---------|
| flutter_bloc | ^8.1.6 | State management |
| get_it + injectable | ^7.7.0 / ^2.4.4 | Dependency Injection |
| dio + pretty_dio_logger | ^5.7.0 / ^1.4.0 | HTTP + debug log |
| freezed + json_serializable | ^2.5.2 / ^6.8.0 | Code-gen |
| dartz | ^0.10.1 | `Either<L, R>` functional |
| flutter_secure_storage | ^9.2.2 | Token lưu an toàn |
| go_router | ^14.6.2 | Navigation |
| google_fonts | ^6.2.1 | Inter font |
| intl | ^0.20.0 | Date format + l10n |
| shared_preferences | ^2.3.3 | Non-sensitive local storage |
| connectivity_plus | ^6.1.1 | Network check |

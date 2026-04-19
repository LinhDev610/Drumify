# 🔐 Secure Storage — Lưu Token An Toàn

**File:** `lib/core/storage/secure_storage.dart`

Dùng `flutter_secure_storage` — lưu vào **Keychain (iOS)** và **EncryptedSharedPreferences (Android)**.

---

## Cách dùng

### Lưu token sau khi login:
```dart
// Inject qua DI: getIt<SecureStorage>()
await secureStorage.saveTokens(
  accessToken: response.accessToken,
  refreshToken: response.refreshToken,
);
```

### Đọc token (AuthInterceptor tự động làm điều này):
```dart
final token = await secureStorage.getAccessToken();
```

### Xóa token khi logout:
```dart
await secureStorage.clearTokens();
await secureStorage.deleteAll(); // xóa toàn bộ nếu cần
```

### Lưu data tùy chỉnh:
```dart
await secureStorage.write(key: 'biometric_enabled', value: 'true');
final value = await secureStorage.read(key: 'biometric_enabled');
```

---

## Token Refresh Flow

`AuthInterceptor` tự động xử lý refresh:

```
Request → [AuthInterceptor.onRequest]
         → Đính kèm token: Authorization: Bearer <access_token>
         → [Server]
         
401 Response → [AuthInterceptor.onError]
             → Gọi POST /auth/refresh với refresh_token
             → Nhận access_token mới
             → Lưu token mới vào SecureStorage
             → Retry request gốc với token mới
             
Refresh thất bại → clearTokens() → redirect về Login
```

---

## Config Platform

| Platform | Storage | Encryption |
|----------|---------|-----------|
| iOS | Keychain | System Keychain |
| Android | EncryptedSharedPreferences | AES-256 |
| Web | localStorage | ⚠️ Không secure — chỉ dùng cho dev |

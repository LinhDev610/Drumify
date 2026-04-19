# 🔧 Utilities & Helpers

## 1. DateTimeUtils

**File:** `lib/core/utils/date_time_utils.dart`

### Format

| Method | Input | Output |
|--------|-------|--------|
| `formatDate(dt)` | DateTime | `15/03/2025` |
| `formatTime(dt)` | DateTime | `09:30` |
| `formatDateTime(dt)` | DateTime | `15/03/2025 09:30` |
| `formatFullDate(dt)` | DateTime | `Thứ Bảy, 15 Tháng 3 2025` |
| `formatMonth(dt)` | DateTime | `Tháng 3 2025` |

### Relative time
```dart
DateTimeUtils.timeAgo(dt)
// → 'Vừa xong' / '5 phút trước' / 'Hôm qua' / '2 tuần trước'
```

### Parse an toàn
```dart
// Trả về null thay vì throw nếu string lỗi
final dt = DateTimeUtils.tryParseIso('2025-03-15T09:30:00Z');

// Parse và convert về local timezone
final local = DateTimeUtils.parseToLocal(model.createdAt);
```

---

## 2. StringUtils

**File:** `lib/core/utils/string_utils.dart`

### Validation
```dart
StringUtils.isEmail('user@gmail.com')   // true
StringUtils.isPhone('0901234567')        // true
StringUtils.isPassword('Pass1234!')      // true
```

### Format
```dart
StringUtils.getInitials('Nguyễn Văn An')  // 'NV'
StringUtils.formatPhone('0901234567')      // '090 123 4567'
StringUtils.maskEmail('user@gmail.com')    // 'us**@gmail.com'
StringUtils.formatVnd(1500000)             // '1.500.000 ₫'
StringUtils.truncate('Chuỗi dài...', 10)  // 'Chuỗi d...'
```

---

## 3. Validators

**File:** `lib/core/utils/validators.dart`

Dùng trực tiếp với `TextFormField.validator`:

```dart
TextFormField(
  validator: Validators.compose([
    Validators.required(),
    Validators.email(),
  ]),
)

TextFormField(
  validator: Validators.password(),
)

// Confirm password — cần reference đến password controller
TextFormField(
  validator: Validators.confirmPassword(
    () => _passwordController.text,
  ),
)
```

---

## 4. AppLogger (Debug)

**File:** `lib/core/debug/api_logger.dart`

```dart
AppLogger.debug('Fetching user data', tag: 'UserRepo');
AppLogger.info('User logged in');
AppLogger.warning('Token sắp hết hạn');
AppLogger.error('Lỗi gọi API', error: e, stackTrace: s);
AppLogger.bloc('ProfileBloc', 'LoadProfileEvent');
```

> ⚠️ **Quan trọng:** Tất cả log đều chỉ chạy trong `kDebugMode`.
> Production build sẽ không có bất kỳ output nào.

### ApiDebugInterceptor — API Console Log
Đã tích hợp `PrettyDioLogger` vào `DioClient`. Log sẽ hiển thị dạng:
```
┌────── REQUEST ──────
│ GET https://api.example.com/users/123
│ Headers: Authorization: Bearer ***
└─────────────────────

┌────── RESPONSE ✅ ──
│ 200 GET https://api.example.com/users/123
│ Data: {id: 123, name: 'Nguyễn Văn An'}
└─────────────────────
```

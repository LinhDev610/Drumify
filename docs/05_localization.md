# 🌐 Localization — Đa ngôn ngữ

## Setup

**Files:**
- `l10n.yaml` — config Flutter gen
- `lib/l10n/app_vi.arb` — Tiếng Việt (template)
- `lib/l10n/app_en.arb` — English
- `lib/core/l10n/l10n.dart` — Extension shorthand

---

## Cách generate code

```bash
# Chạy khi thêm key mới vào ARB file
flutter gen-l10n
```

File generated: `.dart_tool/flutter_gen/gen_l10n/app_localizations.dart`

---

## Cách dùng trong Widget

```dart
// ✅ Dùng extension shorthand (khuyến nghị)
import 'package:jobshare/core/l10n/l10n.dart';

Text(context.l10n.authLogin)
Text(context.l10n.commonOk)

// Hoặc dùng full:
AppLocalizations.of(context)!.authLogin
```

---

## Thêm key mới

1. Mở `lib/l10n/app_vi.arb` (template)
2. Thêm key:
```json
{
  "myNewKey": "Giá trị tiếng Việt",
  "@myNewKey": { "description": "Mô tả key này" }
}
```
3. Thêm translation vào `app_en.arb`:
```json
{
  "myNewKey": "English value"
}
```
4. Chạy `flutter gen-l10n`
5. Dùng: `context.l10n.myNewKey`

---

## Naming Convention cho ARB keys

| Nhóm | Pattern | Ví dụ |
|------|---------|-------|
| Common | `common<Name>` | `commonOk`, `commonCancel` |
| Auth | `auth<Name>` | `authLogin`, `authEmail` |
| Error | `error<Name>` | `errorNetwork`, `errorServer` |
| Validation | `validation<Name>` | `validationRequired` |
| Feature | `<feature><Name>` | `profileTitle`, `profileUpdate` |

---

## Thêm ngôn ngữ mới

1. Tạo `lib/l10n/app_<locale>.arb`
2. Thêm vào `pubspec.yaml` → `flutter.generate: true`
3. Thêm `Locale('<locale>')` vào `supportedLocales` trong `main.dart`

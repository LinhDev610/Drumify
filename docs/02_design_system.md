# 🎨 Design System — Font, Màu sắc, Theme

## Tổng quan

Design System được định nghĩa tập trung ở `lib/core/theme/`. Không bao giờ hardcode
màu sắc hay font-size trong widget — luôn tham chiếu qua các class sau.

---

## 1. AppColors — Bảng màu

**File:** `lib/core/theme/app_colors.dart`

| Nhóm | Key | Hex | Dùng khi |
|------|-----|-----|----------|
| Brand | `primary` | `#2563EB` | Nút chính, link, focus |
| Brand | `primaryLight` | `#3B82F6` | Hover state |
| Brand | `primaryContainer` | `#DBEAFE` | Background chip, badge |
| Secondary | `secondary` | `#7C3AED` | Accent colors |
| Status | `success` | `#16A34A` | Success toast, icon |
| Status | `error` | `#DC2626` | Lỗi, validation |
| Status | `warning` | `#D97706` | Cảnh báo |
| Status | `info` | `#0284C7` | Thông tin |
| Neutral | `neutral900–50` | Gray scale | Text, border, bg |
| Surface | `background` | `#F9FAFB` | Scaffold background |
| Surface | `surface` | `#FFFFFF` | Card, bottom sheet |
| Dark | `darkBackground` | `#0F172A` | Dark scaffold |
| Dark | `darkSurface` | `#1E293B` | Dark card |

### Cách dùng:
```dart
// ✅ Đúng
color: AppColors.primary

// ❌ Sai
color: Color(0xFF2563EB)
```

---

## 2. AppTextStyles — Typography Scale

**File:** `lib/core/theme/app_text_styles.dart`

Font: **Inter** (Google Fonts)

| Style | Size | Weight | Dùng khi |
|-------|------|--------|----------|
| `displayLarge` | 32 | Bold 700 | Màn hình splash, hero text |
| `displayMedium` | 28 | Bold 700 | Header màn hình lớn |
| `headlineLarge` | 22 | SemiBold 600 | Section title |
| `headlineMedium` | 20 | SemiBold 600 | Page title |
| `titleLarge` | 16 | SemiBold 600 | AppBar title, card title |
| `titleMedium` | 14 | Medium 500 | Sub-title, tab label |
| `bodyLarge` | 16 | Regular 400 | Content text |
| `bodyMedium` | 14 | Regular 400 | Body text (default) |
| `bodySmall` | 12 | Regular 400 | Caption, helper |
| `labelLarge` | 14 | Medium 500 | Button label |
| `button` | 15 | SemiBold 600 | ElevatedButton |
| `caption` | 11 | Regular 400 | Timestamp, meta |

### Cách dùng:
```dart
// ✅ Đúng
Text('Hello', style: AppTextStyles.titleLarge)

// ❌ Sai
Text('Hello', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600))
```

---

## 3. AppTheme — ThemeData

**File:** `lib/core/theme/app_theme.dart`

### Constants dùng chung:
```dart
AppTheme.radiusSM   // 8.0  — input border, button
AppTheme.radiusMD   // 12.0 — card
AppTheme.radiusLG   // 16.0 — bottom sheet
AppTheme.radiusFull // 999  — chip, avatar border

AppTheme.spacingXS  // 8.0
AppTheme.spacingMD  // 16.0 — padding mặc định của màn hình
AppTheme.spacingLG  // 24.0
```

### Dark mode:
App tự động switch light/dark theo system preference.
Không cần logic thủ công — ThemeData đã định nghĩa đủ cả 2.

### Cách apply:
```dart
// main.dart — đã setup sẵn
MaterialApp.router(
  theme: AppTheme.light,
  darkTheme: AppTheme.dark,
  themeMode: ThemeMode.system,
)
```

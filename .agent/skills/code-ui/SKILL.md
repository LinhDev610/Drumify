---
name: code-ui
description: >-
  Frontend development (React, MUI, Hooks, Services) for Drumify.
  Use this skill to build UI components, manage frontend state, call backend APIs,
  and implement responsive designs using MUI and Glassmorphism tokens.
  Trigger on: "viết frontend", "tạo component", "giao diện react", "mui styling", "viết hook", "gọi api frontend", "admin dashboard", "cashier ui", "pos interface", "sidebar config".
---

# 🎨 Code UI

Kỹ năng chuyên biệt cho việc phát triển giao diện người dùng và logic phía client.

## 🛠️ Standards & Patterns

### 1. Styling Stack
-   **MUI 7**: Component library chính.
-   **`sx` prop**: Inline styling cho các chỉnh sửa nhanh.
-   **CSS Variables**: Sử dụng các token như `--color-border`, `--color-accent-gold`.
-   **Pattern**: Glassmorphism (nền mờ, border mỏng).

### 2. Service Layer (API Interaction)
-   Luôn đặt trong `frontend/src/services/`.
-   Sử dụng `httpClient` (axios wrapper) để tự động gắn Token.
-   Sử dụng `unwrapList` hoặc `unwrapResult` để bóc tách dữ liệu từ `ApiResponse`.

### 3. Hooks & State
-   Custom hooks trong `frontend/src/hooks/` cho các logic tái sử dụng.
-   Sử dụng `KeycloakAuthContext` để kiểm tra quyền (`hasRole`, `hasGroup`).

### 4. Workspace Pattern (Admin)
-   Các trang quản lý sử dụng Tab-based layout.
-   Đăng ký tab mới trong `*_TAB_CONFIG` của file Workspace tương ứng.

## ♻️ Reuse-first Policy
Trước khi tạo mới, hãy kiểm tra `frontend/src/components/Common/`:
-   `ConfirmDialog`: Modal xác nhận.
-   `StatusBadge`: Hiển thị trạng thái.
-   `Pagination`: Phân trang.
-   `LoadingBar`: Thanh loading.

## 🚫 Forbidden Actions
-   KHÔNG gọi `axios` trực tiếp trong component.
-   KHÔNG hardcode mã màu (ưu tiên MUI theme hoặc CSS variables).
-   KHÔNG bỏ qua Route Guard.

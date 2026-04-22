# 🎨 Styleguide — Drumify

Quy chuẩn về thiết kế và phong cách code trong dự án.

## 🌈 Design System (MUI + Glassmorphism)
Dự án sử dụng Material UI 7 kết hợp với phong cách Glassmorphism.

### Colors
- **Border**: `--color-border` (rgba(255,255,255,0.1))
- **Accent**: `--color-accent-gold` (#FFD700)
- **Success/Error**: Theo MUI theme colors.

### UI Patterns
- **Cards**: Sử dụng `Paper` hoặc `Card` với `variant="outlined"` và nền mờ.
- **Buttons**: Ưu tiên `Button` từ MUI, sử dụng `color="primary"` cho hành động chính.
- **Badges**: Sử dụng `StatusBadge` (Common component) để hiển thị trạng thái.

## 🏷️ Naming Conventions

### Backend (Java)
- **Entities**: `PascalCase` (ví dụ: `Product`)
- **Repositories**: `{Entity}Repository`
- **Services**: `{Entity}Service`
- **Controllers**: `{Entity}Controller`
- **DTOs**: `{Action}{Entity}Request` / `{Entity}Response`

### Frontend (React)
- **Components**: `PascalCase.jsx`
- **Hooks**: `use{Action}.js`
- **Services**: `{module}Service.js`
- **Constants**: `UPPER_SNAKE_CASE`

## 📏 Coding Rules
- **DRY (Don't Repeat Yourself)**: Tái sử dụng components và services.
- **Clean Code**: Đặt tên biến rõ ràng, hàm ngắn gọn (SRP).
- **Imports**: Luôn sử dụng `import` cho tất cả các class và annotation. TUYỆT ĐỐI không sử dụng đường dẫn đầy đủ (Fully Qualified Name - FQN) trong thân code (ví dụ: tránh dùng `@org.springframework.scheduling.annotation.Async`).
- **Comments**: Comment cho các logic phức tạp, không comment những thứ hiển nhiên.

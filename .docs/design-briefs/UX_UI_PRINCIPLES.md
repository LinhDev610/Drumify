# 📐 UX/UI Principles — Drumify

Tài liệu này định hướng trải nghiệm người dùng và phong cách thiết kế của Drumify.

## 💎 Glassmorphism Style
- **Nền mờ (Backdrop Blur)**: Sử dụng cho các Cards, Modals.
- **Border mỏng**: 1px solid rgba(255, 255, 255, 0.1).
- **Độ tương phản**: Đảm bảo text rõ ràng trên nền mờ.

## 🚀 Trải nghiệm người dùng (UX)
- **Phản hồi tức thì**: Sử dụng `LoadingBar` khi gọi API.
- **Xác nhận hành động**: Luôn dùng `ConfirmDialog` cho các hành động xóa hoặc thay đổi trạng thái quan trọng.
- **Thông báo**: Hiển thị Toast message (Success/Error) sau mỗi hành động.
- **Phân trang**: Sử dụng `Pagination` cho các danh sách dài để tối ưu hiệu năng.

## 📱 Tính đáp ứng (Responsiveness)
- Ưu tiên hiển thị tốt trên màn hình Desktop (Admin Panel).
- Đảm bảo các bảng (Tables) có thanh cuộn ngang trên màn hình nhỏ.

## ⌨️ Phím tắt & Thao tác nhanh
- Hỗ trợ Enter để submit form.
- Hỗ trợ ESC để đóng dialog.

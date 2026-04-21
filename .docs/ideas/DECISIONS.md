# 📜 Project Decisions & Memory (ADR)

Tài liệu này ghi lại các quyết định quan trọng về kiến trúc và nghiệp vụ để AI và Developer có thể tra cứu nhanh.

---

## 📅 2026-04-21: Thêm nhóm người dùng CASHIER (Thu ngân)

### ❓ Bối cảnh
Hệ thống cần mở rộng để hỗ trợ các máy bán hàng tại quầy (POS). Cần một vai trò chuyên biệt có quyền truy cập vào bán hàng nhưng không có toàn quyền quản lý kho hoặc nhân sự.

### 💡 Quyết định
- **Phân quyền (RBAC/GBAC)**: Sử dụng Group `CASHIER`.
- **Backend**: Cập nhật `@PreAuthorize` tại các **service** liên quan đến Order, Product, Category và Report để cho phép `GROUP_CASHIER`.
- **API Mapping**: Đổi tên đường dẫn `/orders/warehouse/workflow` thành `/orders/internal/list` để dùng chung cho cả Kho và Thu ngân.
- **Frontend**: 
  - Thêm `CashierDashboard` với các chỉ số tài chính ca làm.
  - Thêm `CashierWorkspace` với giao diện Tab-based cho POS, Giao dịch, Tra cứu.

### ⚠️ Lưu ý cho tương lai
- POS Interface cần được tối ưu cho tốc độ và thao tác phím tắt.
- Cần cơ chế "Chốt ca" để đối soát tiền mặt.

---

## 📅 2026-04-21: Nâng cấp TypeScript lên 6.x

### ❓ Bối cảnh
`i18next` phiên bản mới yêu cầu TS >= 5, trong khi dự án đang ở 4.9.

### 💡 Quyết định
- Nâng cấp lên `typescript@latest` (6.x).
- Gỡ bỏ `react-quill` (conflicting) và thay bằng `react-quill-new` để hỗ trợ React 19.

---

## 📅 2026-04-21: Chuyển đổi vị trí bảo mật (@PreAuthorize)

### ❓ Bối cảnh
Trước đây `@PreAuthorize` được đặt tại Controller. Điều này dẫn đến việc bảo mật bị bỏ qua nếu Service được gọi từ các component nội bộ khác hoặc từ các tác vụ nền.

### 💡 Quyết định
- **Tầng Service là chốt chặn cuối**: Di chuyển toàn bộ `@PreAuthorize` từ Controller xuống Service.
- **Controller sạch**: Controller chỉ làm nhiệm vụ điều phối (Transport), không chứa logic bảo mật nghiệp vụ.
- **Quy tắc**: Mọi phương thức Service nhạy cảm PHẢI có chú thích bảo mật.

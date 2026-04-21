# 🛒 Frontend Plan: Cashier POS Interface

Kế hoạch triển khai giao diện Bán hàng (POS) dành cho nhóm Thu ngân.

---

## 🎨 Design Vision (Glassmorphism)
- **Layout**: Full-screen, Sidebar collapsed by default.
- **Components**:
  - `ProductScanner`: Ô tìm kiếm nhanh SP và quét mã vạch.
  - `CartSummary`: Danh sách SP trong giỏ hàng hiện tại.
  - `PaymentPanel`: Các nút chọn phương thức thanh toán (Tiền mặt, Chuyển khoản, Thẻ).

---

## 🛠️ Implementation Tasks

### 1. POS Page Components
- [ ] `frontend/src/pages/Admin/Cashier/components/ProductPicker.jsx`
- [ ] `frontend/src/pages/Admin/Cashier/components/OrderSummary.jsx`
- [ ] `frontend/src/pages/Admin/Cashier/components/PaymentModal.jsx`

### 2. Service Integration
- [ ] `frontend/src/services/cashierService.js`:
  - `createPosOrder()`
  - `fetchPosProducts()`
  - `validateVoucher()`

### 3. State Management
- Sử dụng `useState` local cho giỏ hàng POS để đảm bảo tốc độ.
- `localStorage` backup để tránh mất dữ liệu khi reload.

---

## 🔐 Security & Access
- Chỉ hiển thị cho người dùng có `GROUP_CASHIER`.
- Luôn kiểm tra Token trước khi `createPosOrder`.

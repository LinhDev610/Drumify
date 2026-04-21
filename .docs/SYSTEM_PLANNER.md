# 🗺️ Drumify — System Planner & Roadmap

Tài liệu này đóng vai trò là "Bản đồ số" của dự án Drumify, giúp Antigravity định hướng và thực hiện các thay đổi một cách tự động và nhất quán.

---

## 🏗️ Tổng quan Kiến trúc (Architecture Overview)

- **Frontend**: ReactJS + MUI 7 + Vite/CRA.
  - State management: Context API (KeycloakAuthContext).
  - Styling: Vanilla CSS + MUI `sx` + Glassmorphism.
- **Backend**: Spring Boot 3 + Spring Security + OAuth2 (Keycloak).
  - Model: 6-Layer (Controller, Service, Mapper, Repository, Entity, DTO).
- **Database**: MySQL 8.
- **Integration**: GHN (Giao Hàng Nhanh), Cloudinary (Media).

---

## 🔐 Phân quyền & Vai trò (Role & Group Mapping)

| Vai trò (Group) | Phụ trách chính | Tài liệu chi tiết |
|:----------------|:----------------|:------------------|
| **ADMIN** | Toàn quyền hệ thống | `ROLES_AND_PERMISSIONS.md` |
| **CS** | Hỗ trợ khách hàng | `ROLES_AND_PERMISSIONS.md` |
| **HR** | Quản lý nhân sự | `ROLES_AND_PERMISSIONS.md` |
| **WAREHOUSE** | Quản lý kho & Đơn hàng | `ROLES_AND_PERMISSIONS.md` |
| **MARKETING** | Voucher & Chiến dịch | `ROLES_AND_PERMISSIONS.md` |
| **CASHIER** | Thu ngân & POS | `ROLES_AND_PERMISSIONS.md` |

---

## 📂 Quy ước Đặt tên & Folder (Conventions)

- **Docs**: Mọi kế hoạch mới PHẢI đặt trong `.docs/backend-plans/` hoặc `.docs/frontend-plans/`.
- **API Paths**: 
  - `/orders/internal/list`: Danh sách đơn hàng nội bộ.
  - `/warehouse/*`: Nghiệp vụ kho.
- **Frontend Paths**: 
  - `/admin/*`: Workspace cho nhân viên/admin.
  - `/admin/pos`: Điểm bán hàng cho Thu ngân.

---

## 🛠️ Trạng thái Feature (Feature Roadmap)

- ✅ **Lõi Auth**: Keycloak Integration.
* ✅ **Quản lý Kho**: Sản phẩm, Danh mục, Nhập/Xuất.
* ✅ **Quản lý Nhân sự**: Phân quyền Group/Role.
* 🔄 **Thu ngân (In Progress)**:
  - ✅ Thêm Role CASHIER.
  - ✅ Dashboard Thu ngân.
  - 🔄 POS Interface.
  - 🔄 Báo cáo ca làm.

---

## 🤖 Hướng dẫn cho AI (Agent Instructions)

1. **Tự động đọc**: Luôn bắt đầu bằng việc đọc `SYSTEM_PLANNER.md` và `ROLES_AND_PERMISSIONS.md` khi nhận task liên quan đến logic hoặc quyền hạn.
2. **Tuân thủ Layer**: Khi sửa API, phải cập nhật đủ cả 6 layer ở Backend.
   - **BẮT BUỘC**: Chú thích `@PreAuthorize` PHẢI đặt ở tầng Service, tuyệt đối không đặt ở Controller.
   - **Security Expression**: Sử dụng `hasRole('ADMIN')` thay vì `hasAuthority('ROLE_ADMIN')`. Đối với Group vẫn dùng `hasAuthority('GROUP_NAME')`.
   - **Clean Code**: Luôn sử dụng `import` cho các class. KHÔNG viết đầy đủ package (FQN) trong thân code.
3. **Cập nhật Docs**: Sau mỗi task lớn, phải cập nhật tiến độ vào mục "Trạng thái Feature" ở trên.

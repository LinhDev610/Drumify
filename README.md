# 🥁 Drumify - Premium E-commerce Platform for Drums & Percussion

<p align="center">
  <img src="https://img.shields.io/badge/Project-Drumify-blue.svg" alt="Project">
  <img src="https://img.shields.io/badge/Source-LilaShop%20Migration-orange.svg" alt="Source">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
</p>

## 🎯 Tổng quan dự án

**Drumify** là một nền tảng thương mại điện tử chuyên biệt dành cho cộng đồng yêu âm nhạc, tập trung vào **trống cơ, trống điện tử và các nhạc cụ gõ**. 

Dự án này là kết quả của quá trình di chuyển tên miền (migration) từ **LilaShop** (mỹ phẩm) sang lĩnh vực âm nhạc, giữ nguyên cấu trúc kỹ thuật mạnh mẽ nhưng thay đổi toàn bộ hệ sinh thái nội dung và trải nghiệm người dùng.

---

## 🏗️ Kiến trúc & Công nghệ

Hệ thống được thiết kế theo mô hình **Client-Server** hiện đại:

-   **Frontend**: React 19 + Material UI (MUI) 7. Thiết kế lấy cảm hứng từ sự sang trọng, tinh tế.
-   **Backend**: Java 21 + Spring Boot 4. Kiến trúc phân lớp chặt chẽ.
- **Security**: Keycloak (OIDC) tích hợp Custom Event Listener để đồng bộ dữ liệu người dùng tự động sang Backend Database.
- **Cloud Media**: Tích hợp Cloudinary để quản lý hình ảnh người dùng (avatars) và tài liệu sản phẩm, hỗ trợ lưu trữ đám mây tối ưu.

---

## 🔐 Hệ Thống Phân Quyền

Drumify áp dụng mô hình kết hợp **RBAC + GBAC** với 4 Roles (CUSTOMER, STAFF, ADMIN, DIRECTOR) và 4 Groups (CS, HR, WAREHOUSE, MARKETING). Sidebar và trang quản lý được hiển thị động dựa trên vai trò người dùng.  
**STAFF + WAREHOUSE** có quyền vận hành danh mục sản phẩm (`/admin/products`, `/admin/categories`) bên cạnh các nghiệp vụ kho.

👉 **[Xem chi tiết thiết kế phân quyền, sidebar & phạm vi quản lý](./ROLES_AND_PERMISSIONS.md)**

---

## 🔄 Luồng đồng bộ người dùng (Keycloak Auto-Sync)

Hệ thống sử dụng cơ chế **Event-Driven Integration** để đảm bảo dữ liệu người dùng luôn nhất quán giữa Identity Provider (Keycloak) và Backend (MySQL):

1. **Sự kiện**: Khi người dùng đăng ký tài khoản thành công trên Keycloak.
2. **Trigger**: Custom Event Listener (`drumify-registration-listener`) trong Keycloak bắt được sự kiện và thu thập thông tin người dùng.
3. **Hành động**: Gửi yêu cầu HTTPS ngầm (với mã bí mật `X-Internal-Secret`) đến API `/internal/sync` của Backend.
4. **Kết quả**: Backend tạo bản ghi Profile trong Database, sẵn sàng cho các nghiệp vụ mua sắm.

👉 [Xem cấu hình Keycloak](./backend/KEYCLOAK.md) | [Sơ đồ thiết kế & Luồng xử lý Event](./keycloak/EVENT_LISTENER_FLOW.md)

---

## 📷 Quản lý Phương tiện (Cloudinary Integration)

Hệ thống tích hợp **Cloudinary SDK** để quản lý tài nguyên hình ảnh một cách chuyên nghiệp:
- **Avatar Upload**: Cho phép người dùng cập nhật ảnh đại diện trực tiếp.
- **Memoized Display**: Sử dụng kỹ thuật memoization để ngăn chặn tình trạng "nháy" ảnh khi cập nhật các thông tin khác trong hồ sơ.
- **Server-side Clean up**: Tự động dọn dẹp ảnh cũ trên mây khi người dùng đổi ảnh mới.

---

## 📍 Quản lý Địa chỉ (GHN API Integration)

Drumify tích hợp API của **Giao Hàng Nhanh (GHN)** để cung cấp trải nghiệm quản lý địa chỉ chuyên nghiệp:
- **Dữ liệu chuẩn**: Đồng bộ danh sách Tỉnh/Thành, Quận/Huyện, Phường/Xã trực tiếp từ hệ thống GHN.
- **Đa địa chỉ**: Hỗ trợ lưu nhiều địa chỉ với tính năng đặt địa chỉ mặc định.
- **Validation chặt chẽ**: Kiểm tra tính hợp lệ của số điện thoại và các trường thông tin địa lý.
- **Kho vận 2 bước**: Staff kho xác nhận đơn (`confirm`) -> tạo vận đơn GHN thật (`create shipment`) với cơ chế retry + idempotency.
- **Webhook GHN**: Tự động đồng bộ trạng thái vận chuyển về đơn hàng nội bộ khi có sự kiện cập nhật.

---

## 🔐 Bảo mật & Đổi mật khẩu

Tính năng đổi mật khẩu được thiết kế an toàn tuyệt đối:
- **Xác thực 2 lớp**: Yêu cầu xác nhận mật khẩu cũ thông qua luồng *Keycloak Password Grant* trước khi cho phép đặt mật khẩu mới.
- **Sync an toàn**: Sử dụng Admin API của Keycloak để cập nhật mật khẩu ngầm định, đảm bảo đồng bộ hoàn hảo.
- **Trải nghiệm người dùng**: Hỗ trợ trình quản lý mật khẩu của trình duyệt (Firefox, Chrome) và cho phép xác nhận bằng phím `Enter`.

---

## 📂 Tổ chức mã nguồn

| Thư mục / Tài liệu | Nhiệm vụ |
| :--- | :--- |
| **[`/backend`](./backend/README.md)** | Engine xử lý nghiệp vụ, API, Security & CSDL. |
| **[`/frontend`](./frontend/README.md)** | Portal người dùng, giao diện mua sắm & quản lý. |
| **[`ROLES_AND_PERMISSIONS.md`](./ROLES_AND_PERMISSIONS.md)** | Thiết kế phân quyền, sidebar & phạm vi quản lý theo Role/Group. |

---

## 🚀 Khởi chạy nhanh (Unified Quick Start)

Để khởi động toàn bộ hệ thống, thực hiện các bước sau:

### 1. Dịch vụ nền (Services)
Khởi chạy MySQL và Keycloak thông qua Docker.
```bash
# Đảm bảo Database drumify_db đã sẵn sàng
```

### 2. Chạy Backend
```bash
cd backend
mvn spring-boot:run
```

### 3. Chạy Frontend
```bash
cd frontend
npm start
```

---

## 🗺️ Di chuyển tên miền (Domain Mapping)

Toàn bộ logic từ LilaShop đã được ánh xạ sang Drumify một cách chi tiết:
- **Cấu trúc nội dung**: Mỹ phẩm → Nhạc cụ.
- **Thương hiệu**: L'Oréal/Maybelline → Roland/Pearl/DW.
- **Blog**: Góc làm đẹp → Góc tay trống.

---
<p align="center">
  © 2026 - <b>Drumify Development Team</b><br>
  <i>"Premium Beats, Modern Tech"</i>
</p>

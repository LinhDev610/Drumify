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
-   **Security**: Keycloak (OIDC) quản lý danh tính và bảo mật đa kênh.

---

## 📂 Tổ chức mã nguồn

| Thư mục | Nhiệm vụ |
| :--- | :--- |
| **[`/backend`](./backend/README.md)** | Engine xử lý nghiệp vụ, API, Security & CSDL. |
| **[`/frontend`](./frontend/README.md)** | Portal người dùng, giao diện mua sắm & quản lý. |
| **[`/artifacts`](../../.gemini/antigravity/brain/1dadef0a-c496-43bd-880e-24a17e7c881c/artifacts/)** | Tài liệu phân tích, mapping nội dung (LilaShop → Drumify). |

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

👉 [Xem chi tiết bảng ánh xạ nội dung Trang Chủ tại đây](../../.gemini/antigravity/brain/1dadef0a-c496-43bd-880e-24a17e7c881c/artifacts/home_page_content_mapping.md)

---
<p align="center">
  © 2026 - <b>Drumify Development Team</b><br>
  <i>"Premium Beats, Modern Tech"</i>
</p>

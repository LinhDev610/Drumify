# 🥁 DRUMIFY - BACKEND CORE ENGINE

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange.svg" alt="Java">
  <img src="https://img.shields.io/badge/Spring%20Boot-4.0.5-brightgreen.svg" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Security-Keycloak-blue.svg" alt="Keycloak">
  <img src="https://img.shields.io/badge/Database-MySQL-blue.svg" alt="MySQL">
  <img src="https://img.shields.io/badge/Cloud-Cloudinary-blue.svg" alt="Cloudinary">
</p>

Đây là trung tâm xử lý dữ liệu của **Drumify**. Hệ thống được thiết kế để chịu tải tốt, bảo mật cao và dễ dàng mở rộng, phục vụ toàn bộ các dịch vụ cho nền tảng thương mại điện tử nhạc cụ.

---

## 🚀 Tính năng kỹ thuật nổi bật

-   **Bảo mật & Định danh (IAM)**: Tích hợp sâu với **Keycloak** (OIDC). Sử dụng `CustomAuthoritiesConverter` để ánh xạ chính xác quyền hạn (RBAC) và tích hợp **Custom Event Listener** để đồng bộ hóa danh tính người dùng tự động giữa Keycloak và Database hệ thống.
-   **Service-to-Service Communication**: Sử dụng **OpenFeign** để tương tác mượt mà với Keycloak Admin APIs (tạo user, quản lý token).
-   **Warehouse + GHN Fulfillment Flow**: Hỗ trợ luồng 2 bước cho kho (`confirm order` -> `create GHN shipment`), retry/idempotency khi tạo vận đơn và webhook tự đồng bộ trạng thái GHN về đơn hàng.
-   **Kiến trúc Phân lớp (Layered Architecture)**: Đảm bảo Separation of Concerns giữa Controller, Service, Mapping và Repository.
-   **Chuẩn hóa dữ liệu & API**:
    *   Sử dụng **MapStruct** & **Lombok** để tối ưu hóa code.
    *   Hệ thống **Global Exception Handling** bắt trọn mọi lỗi (Auth, Validation, Business) và trả về định dạng `ApiResponse` đồng nhất.
-   **Quản lý Media & Storage**: Tích hợp **Cloudinary SDK** để xử lý upload, lưu trữ và xóa tệp tin đa phương tiện (ảnh đại diện, ảnh sản phẩm) một cách an toàn thông qua `MediaService`.
-   **Code Quality**: Tích hợp **Spotless** linter để tự động định dạng mã nguồn theo chuẩn.

---

## 📂 Sơ đồ cấu trúc (Backend Map)

```text
src/main/java/com/linhdev/drumify/
├── configuration/  # Security, CORS, JWT, Feign Config
├── controller/     # REST Endpoints (Sản phẩm, Đơn hàng, Profile...)
├── dto/            # Data Transfer Objects (Request/Response)
├── entity/         # Database Models (JPA)
├── exception/      # Luồng xử lý lỗi tập trung
├── mapper/         # Logic chuyển đổi Object (Entity <-> DTO)
├── repository/     # Tầng truy xuất dữ liệu MySQL
└── service/        # Business Logic & Keycloak Integration
```

---

## 📖 Hướng dẫn thiết lập & Chạy dự án

### 1. Yêu cầu hệ thống
- **Java 21 (LTS)**
- **Maven 3.9+**
- **Docker Compose** (Dành cho CSDL & Keycloak)

### 2. Cấu hình Cơ sở dữ liệu
Cập nhật thông tin tại `src/main/resources/application.yaml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3307/drumify_db
    username: root
    password: root
```
👉 [Chi tiết cấu hình MySQL](./MYSQL.md)

### 2.1 Cấu hình GHN cho luồng kho vận
```yaml
ghn:
  token-api: <ghn-token>
  shop-id: <ghn-shop-id>
  from-name: Drumify Warehouse
  from-phone: 0900000000
  from-address: <dia-chi-kho>
  from-ward-code: "<ward-code>"
  from-district-id: <district-id>
  webhook-secret: <shared-secret>
```

### 3. Cấu hình Keycloak
Đảm bảo bạn đã Import realm cấu hình của dự án.
👉 [Chi tiết cấu hình Keycloak](./KEYCLOAK.md)

### 4. Build & Khởi động
```bash
# Cấp quyền cho Maven Wrapper
chmod +x mvnw

# Cài đặt và chạy
./mvnw clean install -DskipTests
./mvnw spring-boot:run
```

---

## 🧑‍💻 Đóng góp & Bảo trì
Dự án tuân thủ nghiêm ngặt các quy tắc về code quality. Vui lòng chạy build trước khi commit để đảm bảo Spotless format đúng chuẩn.

---
<p align="center">
  [Quay lại trang chủ dự án](../README.md)<br>
  © 2026 - <b>Drumify Dev Team</b>
</p>
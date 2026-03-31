# 🥁 Drumify - Music & Entertainment Platform

![Java](https://img.shields.io/badge/Java-21-orange.svg) 
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.5-brightgreen.svg) 
![Keycloak](https://img.shields.io/badge/Keycloak-26.5.6-blue.svg) 
![MySQL](https://img.shields.io/badge/Database-MySQL-blue.svg)

**Drumify** là một nền tảng dịch vụ âm nhạc hiện đại, được xây dựng trên kiến trúc hướng dịch vụ mạnh mẽ, bảo mật cao và dễ dàng mở rộng. Dự án tích hợp các công nghệ tiên tiến nhất để mang lại trải nghiệm người dùng tối ưu.

---

## 🚀 Tính năng nổi bật
- **Bảo mật toàn diện**: Xác thực và phân quyền mạnh mẽ thông qua Keycloak OAuth2.
- **Microservices-Ready**: Kiến trúc cho phép tích hợp và mở rộng dễ dàng với Spring Cloud.
- **Chuẩn hóa API**: Sử dụng `ApiResponse` và xử lý lỗi đồng nhất (`ErrorCode`).
- **Tối ưu hiệu suất**: Sử dụng MapStruct và Lombok để giảm thiểu boilerplate code.
- **Code Quality**: Tích hợp Spotless để đảm bảo quy chuẩn viết code sạch.

---

## 🛠️ Công nghệ sử dụng
- **Ngôn ngữ**: Java 21 (LTS)
- **Framework**: Spring Boot 4.0.5
- **Cơ sở dữ liệu**: MySQL / MariaDB
- **Xác thực**: Keycloak (OAuth2 Resource Server)
- **Giao tiếp Dịch vụ**: Spring Cloud OpenFeign
- **Mapping & Tiện ích**: MapStruct, Lombok
- **Kiểm định**: JUnit 5, Mockito

---

## 📂 Cấu trúc dự án
```text
src/main/java/com/linhdev/drumify/
├── configuration/  # Cấu hình Security, CORS, JWT...
├── controller/     # Các RESTful API endpoints
├── dto/            # Data Transfer Objects
├── entity/         # Cấu trúc bảng cơ sở dữ liệu
├── exception/      # Xử lý lỗi tập trung
├── mapper/         # Chuyển đổi giữa Entity và DTO
├── repository/     # Tầng truy xuất dữ liệu
└── service/        # Logic nghiệp vụ chính
```

---

## 📖 Hướng dẫn cài đặt & Chạy dự án

### 📋 Yêu cầu hệ thống
- **Java 21** trở lên.
- **Maven 3.9+**
- **Docker & Docker Compose** (để chạy Keycloak và MySQL).

### ⚙️ Thiết lập bước đầu
1. **Clone dự án**:
   ```bash
   git clone https://github.com/LinhDev610/Drumify.git
   cd Drumify
   ```

2. **Cài đặt Keycloak**:
   Xem hướng dẫn chi tiết tại 👉 [KEYCLOAK.md](./KEYCLOAK.md).

3. **Cấu hình Cơ sở dữ liệu**:
   Tạo database `drumify_db` trong MySQL và cập nhật thông tin trong `src/main/resources/application.yaml`.

4. **Build và Chạy ứng dụng**:
   ```bash
   chmod +x mvnw
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

---

## 🧑‍💻 Đóng góp
Nếu bạn muốn đóng góp cho dự án, vui lòng tạo **Pull Request** hoặc gửi **Issue**. Mọi đóng góp đều được trân trọng!

## 📜 Giấy phép
Dự án được phát hành dưới giấy phép [MIT](https://opensource.org/licenses/MIT).

---
© 2026 - **Drumify Dev Team**
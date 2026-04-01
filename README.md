# 🥁 Drumify - Music & Entertainment Platform

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange.svg" alt="Java">
  <img src="https://img.shields.io/badge/Spring%20Boot-4.0.5-brightgreen.svg" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Keycloak-26.5.6-blue.svg" alt="Keycloak">
  <img src="https://img.shields.io/badge/MySQL-Database-blue.svg" alt="MySQL">
</p>

**Drumify** là một nền tảng dịch vụ âm nhạc hiện đại, được xây dựng trên kiến trúc hướng dịch vụ (Service-Oriented Architecture) mạnh mẽ, bảo mật cao và dễ dàng mở rộng. Dự án tích hợp các công nghệ tiên tiến nhất để mang lại trải nghiệm người dùng tối ưu.

---

## 📑 Mục lục
- [Tính năng nổi bật](#-tính-năng-nổi-bật)
- [Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Hướng dẫn cài đặt & Chạy dự án](#-hướng-dẫn-cài-đặt--chạy-dự-án)
- [Đóng góp](#-đóng-góp)
- [Giấy phép](#-giấy-phép)

---

## 🚀 Tính năng nổi bật
- **Bảo mật toàn diện**: Xác thực và phân quyền mạnh mẽ thông qua Keycloak OAuth2/OpenID Connect.
- **Microservices-Ready**: Kiến trúc cho phép tích hợp và mở rộng dễ dàng với Spring Cloud.
- **Chuẩn hóa API**: Sử dụng `ApiResponse` và xử lý lỗi đồng nhất qua danh sách `ErrorCode`.
- **Tối ưu hiệu suất**: Sử dụng MapStruct và Lombok để giảm thiểu boilerplate code, tăng tốc độ phát triển.
- **Code Quality**: Tích hợp Spotless để đảm bảo quy chuẩn viết code sạch và nhất quán.

---

## 🛠️ Công nghệ sử dụng

| Phân lớp | Công nghệ |
| :--- | :--- |
| **Ngôn ngữ** | Java 21 (LTS) |
| **Framework** | Spring Boot 4.0.5 |
| **Cơ sở dữ liệu** | MySQL / MariaDB |
| **Xác thực** | Keycloak (OAuth2 Resource Server) |
| **Giao tiếp Dịch vụ** | Spring Cloud OpenFeign |
| **Mapping & Tiện ích** | MapStruct, Lombok |
| **Kiểm định** | JUnit 5, Mockito |

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

**2. Khởi tạo & Định cấu hình Keycloak:**
Quản lý danh tính và quyền truy cập (IAM) của ứng dụng được xử lý bởi Keycloak.
👉 **[Xem chi tiết hướng dẫn chạy Keycloak tại đây](./KEYCLOAK.md)**.

**3. Cấu hình Cơ sở dữ liệu:**
👉 **[Xem chi tiết hướng dẫn chạy MySQL tại đây](./MYSQL.md)**.

Tạo Database `drumify_db` trong MySQL và cập nhật thông tin kết nối trong `src/main/resources/application.yaml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3307/drumify_db
    username: root
    password: root
```

**4. Build và Chạy ứng dụng:**
```bash
# Phân quyền thực thi cho Maven Wrapper
chmod +x mvnw

# Xóa target cũ, tải dependencies và đóng gói
./mvnw clean install -DskipTests

# Khởi chạy dịch vụ
./mvnw spring-boot:run
```

---

## 🧑‍💻 Đóng góp
Nếu bạn muốn đóng góp cho dự án, vui lòng tạo **Pull Request** hoặc gửi **Issue**. Mọi đóng góp đều được trân trọng!

## 📜 Giấy phép
Dự án được phát hành dưới giấy phép [MIT](https://opensource.org/licenses/MIT).

---
<p align="center">
© 2026 - <b>Drumify Dev Team</b><br>
<i>Music meets Technology 🎶</i>
</p>
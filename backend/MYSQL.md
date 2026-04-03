# 🗄️ Hướng dẫn Cài đặt & Cấu hình MySQL

Tài liệu này cung cấp các bước chi tiết để thiết lập **MySQL** thông qua Docker cho dự án **Drumify**. Cấu hình này được tối ưu hóa cho môi trường phát triển (Local) giúp team có thể thiết lập cơ sở dữ liệu một cách nhanh chóng.

---

## 1. Yêu cầu hệ thống
- **Docker**: Đã được cài đặt và đang chạy ngầm trên thiết bị của bạn.
- **Cổng 3307**: Đảm bảo cổng này chưa bị chiếm dụng để kết nối an toàn với máy của bạn.

---

## 2. Các bước thiết lập

### Bước 1: Tải MySQL Docker Image
Sử dụng phiên bản **MySQL 8.0.45** (ổn định trên nền tảng Debian được đề xuất cho dự án):
```bash
docker pull mysql:8.0.45-debian
```

### Bước 2: Chạy MySQL Container
Thực thi lệnh sau trong Terminal để khởi tạo Database với tài khoản `root` cơ bản cùng việc map đúng cổng:

```bash
docker run -d \
  --name drumify-mysql-8.0.45 \
  -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  mysql:8.0.45-debian
```

### Giải thích các tham số:**
- `-p 3307:3306`: Ánh xạ cổng `3306` (cổng mặc định của MySQL bên trong container) ra cổng `3307` trên máy tính của bạn, giúp hạn chế xung đột nếu bạn đang chạy một MySQL cục bộ khác trên máy.
- `-e MYSQL_ROOT_PASSWORD=root`: Thiết lập mật khẩu cho tài khoản `root` là `root`.
- `-d`: Chọn chế độ Detached (chạy ngầm).

---

## 3. Khởi tạo Cơ sở dữ liệu (Database Schema)

Sau khi container đã hoạt động, bạn có thể kết nối đến nó thông qua các công cụ quản lý cơ sở dữ liệu (ví dụ: *DBeaver*, *DataGrip* hoặc *MySQL Workbench*) với thông tin sau:
- **Host / URL**: `localhost` (hoặc `127.0.0.1`)
- **Port**: `3307`
- **Username**: `root`
- **Password**: `root`

CẦN tạo trước Schema (database) chứa dữ liệu ứng dụng trước khi ứng dụng Spring Boot khởi chạy:
```sql
CREATE DATABASE drumify_db;
```

---
*Lưu ý: Cần đảm bảo cấu hình kết nối trong file `application.yaml` của dự án (`url: jdbc:mysql://localhost:3307/drumify_db`) trùng khớp với các thông số bên trên.*

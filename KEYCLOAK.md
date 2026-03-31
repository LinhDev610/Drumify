# Hướng dẫn Cài đặt & Cấu hình Keycloak

Tài liệu này cung cấp các bước chi tiết để thiết lập Keycloak cho dự án **Drumify**. Cấu hình này được tối ưu hóa cho môi trường phát triển (Local) và có thể mở rộng sang các môi trường khác (Staging/Production).

## 1. Yêu cầu hệ thống
- **Docker**: Đã được cài đặt và đang chạy.
- **Cổng 8280**: Đảm bảo cổng này chưa bị sử dụng bởi ứng dụng khác.

## 2. Các bước thiết lập

### Bước 1: Tải Keycloak Docker image
Sử dụng phiên bản Keycloak 26.5.6 (ổn định nhất cho dự án):
```bash
docker pull quay.io/keycloak/keycloak:26.5.6
```

### Bước 2: Chạy Keycloak Container
Chạy lệnh sau để khởi tạo Keycloak với các cấu hình mặc định cho môi trường phát triển:

```bash
docker run -d \
  --name drumify_keycloak-26.5.6 \
  -p 8280:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  -e KC_HOSTNAME_STRICT=false \
  -e KC_HTTP_ENABLED=true \
  -v drumify_keycloak_data:/opt/keycloak/data \
  quay.io/keycloak/keycloak:26.5.6 \
  start-dev
```

### Giải thích các tham số:
- `-v drumify_keycloak_data:/opt/keycloak/data`: Gắn Volume để dữ liệu (Realms, Users, Clients) không bị mất khi xóa container.
- `KC_BOOTSTRAP_ADMIN_...`: Thiết lập tài khoản quản trị ban đầu theo chuẩn Quarkus mới nhất.
- `KC_HOSTNAME_STRICT=false`: Cho phép truy cập linh hoạt từ `localhost`. 
- `KC_HTTP_ENABLED=true`: Kích hoạt HTTP (chỉ dùng cho môi trường Test/Dev).
- `start-dev`: Chạy ở chế độ phát triển (bỏ qua các bước kiểm tra HTTPS nghiêm ngặt).

## 3. Thông tin truy cập
- **Admin Console**: [http://localhost:8280/admin](http://localhost:8280/admin)
- **Tài khoản mặc định**: `admin` / `admin`
- **Realm dự kiến**: `Drumify` (Cần tạo thủ công hoặc import nếu có file JSON).

---

## 4. Lưu ý khi triển khai thực tế (Production)
Khi chuyển sang môi trường Production, bạn CẦN thay đổi các tham số sau:
1. `KC_HOSTNAME_STRICT=true`: Chỉ cho phép domain chính thức.
2. `KC_HTTP_ENABLED=false`: Luôn sử dụng HTTPS.
3. Sử dụng Database vật lý (PostgreSQL/MySQL) thay vì H2 nhúng định sẵn trong container.
4. Bảo mật lại Password admin thông qua Docker Secrets hoặc Environment Variables bảo mật hơn.

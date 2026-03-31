# Cài đặt Keycloak (v26.5.6)
Tài liệu hướng dẫn cài đặt và quản lý Keycloak Docker cho dự án Drumify. Cấu hình này được tối ưu cho môi trường phát triển (Local) và sẵn sàng để chuyển đổi sang môi trường triển khai (Production).

## Pull Keycloak Docker image
docker pull quay.io/keycloak/keycloak:26.5.6

## Run Keycloak on port 8280
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

### Giải thích tham số cấu hình
- -v drumify_keycloak_data:/opt/keycloak/data
  + Lưu trữ dữ liệu: Tạo Volume (ổ cứng ảo). Giúp giữ lại Realm, User, Client khi xóa container. Khi deploy, chỉ cần copy Volume này hoặc trỏ vào Database vật lý.

- KC_BOOTSTRAP_ADMIN_...
  + Chuẩn Quarkus: Cấu hình Admin mới nhất của Keycloak 26. Đây là chuẩn bắt buộc phải dùng khi triển khai môi trường Production.

- KC_HOSTNAME_STRICT=false
  + Hostname: Cho phép chạy linh hoạt trên localhost. Khi deploy thật, cần đổi thành true và cấu hình Domain chính thức.

- KC_HTTP_ENABLED=true
  + Giao thức: Kích hoạt HTTP để test local thuận tiện (môi trường Production khuyến nghị dùng HTTPS).

- start-dev
  + Chế độ Dev: Bỏ qua các kiểm tra bảo mật khắt khe để phát triển nhanh hơn tại máy cá nhân.

## Thông tin truy cập
- Trang quản trị (Admin Console): http://localhost:8280/admin
- Tài khoản mặc định: admin / admin
- Cổng kết nối: 8280 (Ánh xạ từ cổng 8080 của container)
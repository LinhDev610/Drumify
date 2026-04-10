# 🔐 Hướng dẫn Cài đặt & Cấu hình Keycloak

Tài liệu này cung cấp các bước chi tiết để thiết lập Keycloak cho dự án **Drumify**. Cấu hình này được tối ưu hóa cho môi trường phát triển (Local) và có thể mở rộng linh hoạt sang các môi trường khác (Staging/Production).

---

## 1. Yêu cầu hệ thống
- **Docker**: Đã được cài đặt và đang chạy.
- **Cổng 8280**: Đảm bảo cổng này chưa bị sử dụng bởi ứng dụng khác.

## 2. Các bước thiết lập

### Bước 1: Tải Keycloak Docker image
Sử dụng phiên bản Keycloak **26.5.6** (ổn định nhất cho dự án):
```bash
docker pull quay.io/keycloak/keycloak:26.5.6
```

### Bước 2: Chạy Keycloak Container
Chạy lệnh sau trong Terminal để khởi tạo Keycloak với các cấu hình mặc định ở chế độ phát triển:

```bash
docker run -d \
  --name drumify_keycloak-26.5.6 \
  -p 8280:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  -e KC_HOSTNAME_STRICT=false \
  -e KC_HTTP_ENABLED=true \
  -e DRUMIFY_BACKEND_URL=http://host.docker.internal:8080/drumify \
  -e DRUMIFY_SYNC_SECRET=DrumifySyncSecret2026 \
  -v drumify_keycloak_data:/opt/keycloak/data \
  -v $(pwd)/custom_event_listener_provider/target/registration-event-listener.jar:/opt/keycloak/providers/registration-event-listener.jar \
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

- 🔗 **Admin Console**: [http://localhost:8280/admin](http://localhost:8280/admin)
- 👤 **Tài khoản mặc định**: `admin` / `admin`
- 🛡️ **Realm dự kiến**: `Drumify` *(Bạn cần tạo Realm thủ công thông qua giao diện Admin hoặc import từ file JSON được cung cấp).*

---

## 4. Custom Event Listener (Đồng bộ User)
Dự án sử dụng một Event Listener tùy chỉnh để tự động tạo Profile ở Backend khi có người dùng đăng ký tại Keycloak UI.

**Yêu cầu:** 
- File JAR tại `custom_event_listener_provider/target/registration-event-listener.jar` phải được build trước khi chạy Docker (`mvn clean package`).
- Kiểm tra biến môi trường `DRUMIFY_BACKEND_URL` và `DRUMIFY_SYNC_SECRET` phải khớp với cấu hình Backend.

**Kích hoạt:**
Sau khi khởi động, truy cập **Realm Settings > Events > Config** và thêm `drumify-registration-listener` vào danh sách **Event Listeners**.

---

## 🛠️ 6. Gỡ lỗi phổ biến (Troubleshooting)

| Vấn đề | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| **Lỗi 401 Unauthenticated** | `X-Internal-Secret` không khớp giữa Keycloak và Backend. | Kiểm tra biến `DRUMIFY_SYNC_SECRET` trong Docker và `app.sync-secret` trong `application.yaml`. |
| **Lỗi 405 Method Not Allowed** | Keycloak hoặc Postman đang gửi yêu cầu bằng phương thức `GET`. | Đảm bảo sử dụng phương thức **POST**. Kiểm tra Redirect (http -> https) có thể làm mất Method. |
| **Dữ liệu không vào DB** | Keycloak chưa nạp đúng JAR hoặc chưa kích hoạt Listener. | Kiểm tra `docker logs` để xem Event Listener có in ra dòng "Syncing user..." không. Đã thêm Listener trong `Events > Config` chưa? |
| **Lỗi 9999 / 500** | Lỗi logic tại Service hoặc Mapper ở Backend. | Kiểm tra Log của Backend để xem thông tin Throwable chi tiết. |

---

## 5. ⚠️ Lưu ý khi triển khai thực tế (Production)
Khi chuyển ứng dụng sang môi trường Production, bạn CẦN bắt buộc thay đổi các tham số sau:
1. Đặt `KC_HOSTNAME_STRICT=true` để chỉ cho phép domain chính thức.
2. Đặt `KC_HTTP_ENABLED=false` để luôn sử dụng HTTPS.
3. Sử dụng Database vật lý (PostgreSQL / MySQL / MariaDB) thay vì H2 nhúng định sẵn trong container.
4. Bảo mật lại Password Admin thông qua *Docker Secrets* hoặc *Environment Variables* an toàn hơn.

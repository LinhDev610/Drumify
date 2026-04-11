# Keycloak Custom Event Listener - Kiến trúc và Luồng (Flow)

Tài liệu này giải thích chi tiết về cách hệ thống Drumify nhận và xử lý các sự kiện (Events) từ Keycloak để đồng bộ dữ liệu với Backend.

## 1. Kiến trúc thiết kế (Design)

Hệ thống sử dụng cơ chế **Custom Event Listener SPI (Service Provider Interface)** của Keycloak để mở rộng tính năng mà không cần thay đổi mã nguồn Keycloak.

### Các thành phần chính:

*   **`RegistrationEventListenerFactory`**: 
    *   **Loại**: `EventListenerProviderFactory`
    *   **Vai trò**: Khởi tạo và quản lý vòng đời của Provider.
    *   **Cấu hình**: Đọc các tham số từ biến môi trường:
        *   `DRUMIFY_BACKEND_URL`: URL của Backend API (mặc định: `http://host.docker.internal:8080/drumify`)
        *   `DRUMIFY_SYNC_SECRET`: Mã bí mật để xác thực với Backend (mặc định: `DrumifySyncSecret2026`)
*   **`RegistrationEventListener`**:
    *   **Loại**: `EventListenerProvider`
    *   **Vai trò**: Lắng nghe và xử lý logic khi có sự kiện xảy ra.
    *   **Cơ chế liên lạc**: Sử dụng `Java HttpClient` để gửi các request bất đồng bộ (Async) sang Backend.

---

## 2. Luồng hoạt động (Flow)

### A. Luồng Đăng ký (Registration Flow)
Đây là luồng quan trọng nhất để đảm bảo thông tin User luôn được đồng bộ sang hệ thống Drumify ngay khi họ vừa tạo tài khoản.

1.  **Sự kiện kích hoạt**: Người dùng hoàn tất đăng ký trên giao diện Keycloak.
2.  **Capture Event**: Keycloak bắn ra sự kiện `REGISTER`. Listener bắt được sự kiện này trong phương thức `onEvent(Event event)`.
3.  **Thu thập dữ liệu**: Listener sử dụng `KeycloakSession` để lấy thông tin chi tiết của User vừa đăng ký (ID, Username, Email, FirstName, LastName).
4.  **Đóng gói**: Dữ liệu được chuyển đổi sang định dạng JSON.
5.  **Đồng bộ (Sync)**:
    *   Listener thực hiện một cuộc gọi **POST** tới `/internal/sync?userId={id}`.
    *   Header: `X-Internal-Secret` chứa mã bí mật để Backend xác thực request.
    *   **Lưu ý**: Việc gọi API là **Async** để không làm chậm quá trình đăng ký của người dùng trên Keycloak.
6.  **Backend xử lý**: Backend nhận request, kiểm tra secret key, sau đó lưu/cập nhật Profile trong database của mình.

### B. Luồng Đăng nhập (Login Flow)
*   Hiện tại, hệ thống đã có cấu trúc để sẵn sàng xử lý sự kiện `LOGIN`.
*   Khi người dùng đăng nhập, Keycloak bắn ra sự kiện `LOGIN`.

---

## 3. Cài đặt và Triển khai
*   Mã nguồn nằm tại: `keycloak/custom_event_listener_provider`
*   File đăng ký SPI: `src/main/resources/META-INF/services/org.keycloak.events.EventListenerProviderFactory`
*   Đóng gói: Sử dụng Maven để build file `.jar` và copy vào thư mục `/providers` của Keycloak.

---

## 4. Bảo mật
Việc đồng bộ sử dụng cơ chế **Shared Secret**:
*   Keycloak gửi Secret Key trong header `X-Internal-Secret`.
*   Backend so khớp key này với cấu hình `app.sync-secret` trong `application.properties`.
*   Nếu không khớp, Backend sẽ từ chối request (`401/500`) để đảm bảo không ai có thể giả mạo việc tạo User trái phép.

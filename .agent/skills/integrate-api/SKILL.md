---
name: integrate-api
description: >-
  Integration of 3rd-party services (GHN, Stripe, Cloudinary, Mailchimp) for Drumify.
  Enforces strict authentication patterns (Bearer, API Key) and global error mapping.
  Trigger on: "tích hợp api", "kết nối ghn", "stripe payment", "cloudinary upload", "external service".
---

# 🔌 Integrate API

Kỹ năng chuyên biệt cho việc tích hợp các dịch vụ bên thứ ba.

## 🛑 MANDATORY STEP: The Interview
Trước khi viết code, bạn **PHẢI** phỏng vấn user để thu thập:
1.  **Service Type**: (e.g., Thanh toán, Giao hàng, Lưu trữ...)
2.  **Auth Strategy**: (Bearer Token, API Key, Basic Auth...)
3.  **Credentials**: Hỏi tên biến/key trong config, KHÔNG hỏi giá trị thật.
4.  **Module Target**: Nơi tích hợp này sẽ nằm ở đâu trong project?

## 🏗️ Standards

### 1. Client Layer (`com.linhdev.drumify.client`)
-   Sử dụng `RestClient` (Spring Boot 4) cho các yêu cầu HTTP.
-   Tạo các DTO riêng cho external API (ví dụ: `GhnCreateOrderRequest`).
-   Unwrap response của external API về dạng chuẩn nếu cần.

### 2. Configuration
-   Sử dụng `@ConfigurationProperties` để load config từ `application.yml`.
-   KHÔNG hardcode URLs hoặc Keys.

### 3. Error Mapping
-   Ánh xạ các lỗi từ external API (400, 401, 500) sang `ErrorCode` nội bộ.
-   Sử dụng `ErrorNormalizer` nếu cần xử lý logic mapping phức tạp.

## 📋 Hướng dẫn tích hợp mới
1.  Xác định loại dịch vụ (Thanh toán, Giao vận, Lưu trữ...).
2.  Xác định cơ chế Auth (Bearer Token, API Key...).
3.  Tạo Client class trong package `client/`.
4.  Cấu hình trong `application.yml`.
5.  Viết Service wrapper để gọi Client và xử lý nghiệp vụ nội bộ.

## ⚠️ Bảo mật
-   Mọi endpoint trigger API bên thứ ba phải có `@PreAuthorize`.
-   Sử dụng biến môi trường cho các thông tin nhạy cảm.

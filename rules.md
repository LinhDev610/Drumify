# Drumify AI Rulesbook

<p align="center">
  <img src="https://img.shields.io/badge/Project-Drumify-1f6feb" alt="Project"/>
  <img src="https://img.shields.io/badge/Mode-Deterministic-6f42c1" alt="Mode"/>
  <img src="https://img.shields.io/badge/Scope-Backend%20%2B%20Frontend%20%2B%20Keycloak-0e8a16" alt="Scope"/>
  <img src="https://img.shields.io/badge/Policy-Strict-d73a49" alt="Policy"/>
</p>

Tài liệu này tập trung giải thích mục đích cụ thể của từng thành phần trong kiến trúc Drumify — tại sao cần nó, nó làm gì, và code trông như thế nào trong thực tế. Kiến trúc chọn **layer-first** để Repository và Model được share dễ dàng giữa nhiều feature mà không bị duplicate hay cross-import lằng nhằng.

---

## 0. Thứ tự ưu tiên & Xử lý xung đột

Khi có sự mâu thuẫn giữa các chỉ dẫn, hãy áp dụng theo thứ tự ưu tiên từ cao xuống thấp:

1.  **Chỉ dẫn trực tiếp từ User** (User explicit instruction).
2.  **Section 1: AI Behavior Rules** (Quy chuẩn hành vi AI).
3.  **Section 6: Forbidden Actions** (Những điều cấm kỵ).
4.  **Các Section còn lại (2-5)**.
5.  **Sở thích cá nhân/Style tùy chọn**.

**Chính sách xử lý xung đột:**
- Nếu quy tắc mâu thuẫn, hãy tuân theo cấp độ cao hơn và nêu rõ lý do đánh đổi.
- Nếu yêu cầu không rõ ràng, **PHẢI HỎI** trước khi viết code.
- Nếu thay đổi có nguy cơ phá vỡ logic production, phải cảnh báo và chờ xác nhận.

---

## 1. AI Behavior Rules (Quy chuẩn hành vi AI)

### 1.1 Thay đổi kiến trúc
- **PHẢI** hỏi ý kiến trước khi thay đổi: ranh giới các layer, chiến lược thư mục, luồng bảo mật, model persistence, cấu trúc API contract, DTO schema, hoặc thêm thư viện mới.
- **KHÔNG ĐƯỢC** tự ý áp dụng những thay đổi này nếu chưa có sự đồng ý.

### 1.2 Tái sử dụng (Reuse-first)
- **PHẢI** tìm kiếm và tái sử dụng các component, hook, service, DTO, mapper, utility có sẵn.
- Chỉ tạo mới khi không có giải pháp thay thế phù hợp.

### 1.3 Chống trùng lặp (Duplicate Prevention)
- **KHÔNG ĐƯỢC** tạo các tệp trùng lặp hoặc triển khai song song các logic có cùng nhiệm vụ.
- **KHÔNG ĐƯỢC** tạo các tệp có hậu tố `*Copy`, `*New`, `*Temp` hoặc các phiên bản trùng lặp.

### 1.4 Bảo tồn Naming & Style
- **PHẢI** tuân thủ chính xác quy ước đặt tên và phong cách của dự án hiện tại.
- Mã nguồn mới phải hòa hợp với các pattern đang được sử dụng trong module mục tiêu.

### 1.5 Giao tiếp về thay đổi lớn
- **PHẢI** giải thích kế hoạch thay đổi lớn và chờ xác nhận.
- Thay đổi lớn bao gồm: refactor liên module, thay đổi contract giữa backend+frontend, thay đổi auth/security, cấu trúc route, persistence model, hoặc thêm dependency.

---

## 2. Backend Layer — Chi tiết từng thành phần

### 📦 Controller
`backend/src/main/java/com/linhdev/drumify/controller/`

- **Nhiệm vụ:** Tiếp nhận request, gọi Service và trả về response.
- **Quy tắc:** MUST be transport-only. Sử dụng DTO cho mọi I/O. Validate tại boundary bằng `@Valid`.
- **Ví dụ:**
```java
@PostMapping("/checkout")
public ApiResponse<OrderResponse> checkout(@RequestBody @Valid CheckoutRequest request) {
    // Controller chỉ validate và chuyển lời cho Service
    return ApiResponse.<OrderResponse>builder()
            .result(orderService.processCheckout(request))
            .build();
}
```

### ⚡ Service
`backend/src/main/java/com/linhdev/drumify/service/`

- **Nhiệm vụ:** Xử lý nghiệp vụ, quản lý transaction, check quyền.
- **Quy tắc:** Sử dụng `@Transactional` cho luồng ghi nhiều thực thể. Business failure phải throw `AppException(ErrorCode.X)`.
- **Ví dụ:**
```java
@Transactional
public OrderResponse processCheckout(CheckoutRequest request) {
    // 1. Check business rules (inventory, user balance...)
    // 2. Orchestrate repositories
    // 3. Throw AppException nếu sai luật
    if (!inventoryService.isAvailable(request.getProductId())) {
        throw new AppException(ErrorCode.OUT_OF_STOCK);
    }
    // ...
}
```

### 🛡️ Security & Error Handling
- **Security:** Bảo tồn mô hình Keycloak JWT. Sử dụng `@PreAuthorize` với role/group hiện có.
- **Errors:** Mọi lỗi phải tập trung tại `GlobalExceptionHandler`. KHÔNG rò rỉ stack trace. KHÔNG nuốt exception âm thầm.

---

## 3. Frontend Layer — UI và State tách biệt

### 🧱 Component & Layout
- **Component:** Tập trung vào hiển thị (UI-focused). Giữ component nhỏ gọn và dễ đọc.
- **Layout:** Tuân thủ phân cấp `MainLayout`, `AdminLayout`. Guard route bằng `ProtectedRoute` hoặc `RoleProtectedRoute`.

### 🛠️ API Access & Services
- **httpClient:** PHẢI sử dụng `frontend/src/configurations/httpCient.js`.
- **Logic:** API call phải nằm trong `frontend/src/services/*`. Tái sử dụng `unwrapResult`, `getErrorMessage`.
- **Ví dụ:**
```javascript
export const getMyProfile = async () => {
    const res = await httpClient.get(API.PROFILE);
    return unwrapResult(res); // Bóc tách dữ liệu chuẩn Drumify
};
```

### 📝 Forms & Styling
- **Forms:** Sử dụng controlled components. Validate rõ ràng trước khi submit.
- **Payload:** Chuẩn hóa dữ liệu trước khi gửi (trim chuỗi, chuyển đổi số...).
- **Styling:** Tuân thủ MUI + `sx` + token (`--color-*`). Sử dụng SCSS modules nếu đã có sẵn.

---

## 4. Quy tắc đặt tên (Naming Rules)

- **Chung:** Tên phải mô tả đúng mục đích, rõ ràng, hướng domain. Tránh viết tắt tùy tiện.
- **Backend:** 
    - Class: `PascalCase`. 
    - Suffix bắt buộc: `*Controller`, `*Service`, `*Repository`, `*Mapper`, `*Request`, `*Response`.
- **Frontend:**
    - Component/Page: `PascalCase`.
    - Hook: `useXxx`.
    - Service: verb + domain.
    - Constant: `UPPER_SNAKE_CASE`.
- **Legacy:** Bảo tồn các tên cũ đang hoạt động dù sai chính tả (ví dụ: `httpCient.js`) trừ khi được yêu cầu refactor cụ thể.

---

## 5. API Contract & Quality Gates

### 5.1 API Contract
- Response luôn phải bọc trong `ApiResponse<T>` với field `result`.
- Endpoint thiết kế hướng tài nguyên (Resource-oriented), tuân thủ ngữ nghĩa HTTP verbs.

### 5.2 Quality Gates (Kiểm soát chất lượng)
Trước khi hoàn tất, AI phải tự kiểm tra:
1.  **Scope gate:** Chỉ thay đổi các tệp cần thiết; không làm xáo trộn các tệp không liên quan.
2.  **Contract gate:** Đồng bộ DTO/Response giữa Backend và Frontend nếu cả hai cùng thay đổi.
3.  **Runtime gate:** Đảm bảo app vẫn chạy (không lỗi import, route, DI).
4.  **Error-path gate:** Đảm bảo các luồng lỗi được xử lý tường minh, không làm sập ứng dụng.

---

## 6. Những điều cấm kỵ (Forbidden Actions)

AI **TUYỆT ĐỐI KHÔNG ĐƯỢC**:
- Đưa logic nghiệp vụ vào Controller.
- Expose trực tiếp thực thể JPA ra API.
- Bỏ qua cấu trúc `ApiResponse<T>` trong các module backend hiện có.
- Gọi Axios trực tiếp từ Component khi đã có module service.
- Thêm thư viện quản lý State toàn cục mới nếu không được yêu cầu.
- Bỏ qua route guard hoặc xóa bỏ authorization để "chạy cho nhanh".
- Hardcode bí mật (tokens, credentials).
- Tự ý đổi tên/di chuyển các tệp legacy để "dọn dẹp" mà không hỏi.
- Để lại `TODO` trong mã nguồn production.

---

## 💡 Tóm tắt SRP: Mỗi thành phần chỉ làm đúng 1 việc:

-   **Model/Entity:** "Tao là cấu trúc Database".
-   **DTO:** "Tao là hình ảnh dữ liệu khi đi du lịch (I/O)".
-   **Mapper:** "Tao là người phiên dịch giữa Entity và DTO".
-   **Repository:** "Tao chỉ biết cách nói chuyện với Database".
-   **Service:** "Tao lo logic nghiệp vụ và luật chơi".
-   **Controller:** "Tao nghe điện thoại từ client và gửi đơn hàng cho Service".
-   **Hooks:** "Tao lo việc gom dữ liệu và trạng thái cho UI".
-   **Component:** "Tao chỉ lo đẹp và lắng nghe user click".

---
> [!IMPORTANT]
> TUÂN THỦ TUYỆT ĐỐI CÁC QUY TẮC TRÊN. MỌI SAI PHẠM SẼ ĐƯỢC COI LÀ LRI (LOGIC REFACTORING ISSUE).

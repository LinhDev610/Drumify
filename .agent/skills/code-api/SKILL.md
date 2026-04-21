---
name: code-api
description: >-
  Backend API development (DTOs, Mappers, Services, Controllers, Error Handling) for Drumify.
  Use this skill to implement business logic, create REST endpoints, define I/O boundaries,
  and handle application-wide errors.
  Trigger on: "viết service", "tạo controller", "viết api", "tạo dto", "mapstruct", "xử lý lỗi", "backend order", "internal api", "management endpoint", "cashier logic".
---

# 🚀 Code API

Kỹ năng chuyên biệt cho việc phát triển tầng nghiệp vụ và giao diện lập trình (API).

## 🛠️ Standards & Patterns

### 1. DTO (Data Transfer Object)
-   Phân loại trong `dto/{module}/`.
-   `Request`: Dữ liệu từ client gửi lên.
-   `Response`: Dữ liệu trả về cho client.
-   Sử dụng `@JsonInclude(JsonInclude.Include.NON_NULL)`.

### 2. Mapper (MapStruct)
-   Sử dụng `@Mapper(componentModel = "spring")`.
-   Dùng để chuyển đổi giữa Entity và DTO.

### 3. Service (Business Logic)
-   Sử dụng `@Service`, `@RequiredArgsConstructor`.
-   Sử dụng `@Transactional` cho các thao tác ghi dữ liệu.
-   Xử lý logic và throw `AppException` với `ErrorCode` tương ứng.

### 4. Controller (Transport Layer)
-   Sử dụng `@RestController`, `@RequestMapping`.
-   Mọi API response PHẢI bọc trong `ApiResponse<T>`.
-   **QUY TẮC QUAN TRỌNG**: KHÔNG sử dụng `@PreAuthorize` tại Controller.

### 5. Security (Service Layer)
-   **BẮT BUỘC**: Sử dụng `@PreAuthorize` tại tầng Service để đảm bảo an ninh từ bên trong.
-   **Quy tắc**: Sử dụng `hasRole('NAME')` cho các Role (ví dụ: `hasRole('ADMIN')`) và `hasAuthority('GROUP_NAME')` cho các Group (ví dụ: `hasAuthority('GROUP_WAREHOUSE')`).

**Example Response Wrapper:**
```java
@GetMapping("/{id}")
ApiResponse<ProductResponse> get(@PathVariable String id) {
    return ApiResponse.<ProductResponse>builder()
            .result(productService.getById(id))
            .build();
}
```

### 6. Error Handling
-   Định nghĩa code mới trong `ErrorCode.java`.
-   Sử dụng ranges: 10xx (Auth), 60xx (Product), 70xx (Order/Shipment), v.v.

### 7. Clean Code Standards
-   Sử dụng **Import** cho tất cả các class. TUYỆT ĐỐI không viết đầy đủ đường dẫn (Fully Qualified Name - FQN) trong thân code (ví dụ: `com.package.ClassName`).
-   Giữ class ngắn gọn, tách biệt logic nếu cần.
-   Sử dụng Lombok để giảm boiler plate code.

## ⚠️ SRP Summary
-   **DTO**: Hình dạng dữ liệu.
-   **Mapper**: Phiên dịch dữ liệu.
-   **Service**: Luật chơi và nghiệp vụ.
-   **Controller**: Tiếp nhận và trả lời.

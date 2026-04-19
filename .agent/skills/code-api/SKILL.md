---
name: code-api
description: >-
  Backend API development (DTOs, Mappers, Services, Controllers, Error Handling) for Drumify.
  Use this skill to implement business logic, create REST endpoints, define I/O boundaries,
  and handle application-wide errors.
  Trigger on: "viết service", "tạo controller", "viết api", "tạo dto", "mapstruct", "xử lý lỗi".
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
-   **BẮT BUỘC**: Sử dụng `@PreAuthorize` để kiểm soát quyền truy cập.

**Example Response Wrapper:**
```java
@GetMapping("/{id}")
ApiResponse<ProductResponse> get(@PathVariable String id) {
    return ApiResponse.<ProductResponse>builder()
            .result(productService.getById(id))
            .build();
}
```

### 5. Error Handling
-   Định nghĩa code mới trong `ErrorCode.java`.
-   Sử dụng ranges: 10xx (Auth), 60xx (Product), 70xx (Order/Shipment), v.v.

## ⚠️ SRP Summary
-   **DTO**: Hình dạng dữ liệu.
-   **Mapper**: Phiên dịch dữ liệu.
-   **Service**: Luật chơi và nghiệp vụ.
-   **Controller**: Tiếp nhận và trả lời.

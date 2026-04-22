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
-   **Import Management**: BẮT BUỘC sử dụng `import` cho tất cả các class, interface và annotation.
-   **TUYỆT ĐỐI KHÔNG sử dụng FQN**: Không viết đầy đủ đường dẫn (Fully Qualified Name) trong thân code (ví dụ: TRÁNH dùng `@org.springframework...`). Vi phạm điều này được coi là lỗi Clean Code nghiêm trọng.
-   Giữ class ngắn gọn, tách biệt logic nếu cần.
-   Sử dụng Lombok để giảm boiler plate code.

### 8. Concurrency & Virtual Threads
-   **Virtual Threads**: Hệ thống đã được cấu hình sử dụng Virtual Threads (`spring.threads.virtual.enabled: true`).
-   **CompletableFuture**: Sử dụng `CompletableFuture.supplyAsync()` cho các tác vụ I/O bound (gọi API ngoài, DB).
-   **Shared State**: Tuyệt đối tránh sử dụng biến global/instance trong Singleton Beans có thể bị thay đổi bởi nhiều luồng (Race Condition).
-   **Transactions**: `@Transactional` không tự động truyền vào luồng mới. Phải xử lý logic nghiệp vụ hoặc DB riêng biệt nếu chạy async.
-   **Hibernate Session**: Luôn convert Entity sang DTO ở luồng chính (Main Thread) trước khi đẩy vào luồng song song để tránh lỗi `LazyInitializationException`.
-   **Monitoring**: Sử dụng Spring Boot Actuator để giám sát thread health.

**Example Pattern:**
```java
var future1 = CompletableFuture.supplyAsync(() -> client.getData1());
var future2 = CompletableFuture.supplyAsync(() -> client.getData2());
CompletableFuture.allOf(future1, future2).join();
```

## ⚠️ SRP Summary
-   **DTO**: Hình dạng dữ liệu.
-   **Mapper**: Phiên dịch dữ liệu.
-   **Service**: Luật chơi và nghiệp vụ.
-   **Controller**: Tiếp nhận và trả lời.

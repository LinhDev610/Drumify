# Chiến lược xử lý đồng thời (Concurrency) trong Drumify

## Tổng quan
Drumify tận dụng sức mạnh của **Java 21 Virtual Threads** và **Spring @Async** để xử lý các tác vụ I/O cường độ cao và các tác vụ chạy ngầm một cách hiệu quả.

## Cấu hình
Virtual Threads được kích hoạt trong `application.yaml`:
```yaml
spring:
  threads:
    virtual:
      enabled: true
```

Một Thread Pool được quản lý trong `AsyncConfig.java` cho các tác vụ cần kiểm soát tài nguyên cụ thể:
```java
@Configuration
@EnableAsync
public class AsyncConfig {
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);    // Số luồng luôn duy trì
        executor.setMaxPoolSize(5);     // Số luồng tối đa khi hàng đợi đầy
        executor.setQueueCapacity(100); // Sức chứa hàng đợi
        executor.setThreadNamePrefix("DrumifyAsync-");
        executor.initialize();
        return executor;
    }
}
```

## Các ví dụ thực tế trong Drumify

### 1. Làm giàu dữ liệu song song (`ProfileService`)
Khi lấy danh sách người dùng, chúng ta làm giàu thông tin vai trò (roles) và nhóm (groups) từ Keycloak song song cho từng profile.
**Lưu ý quan trọng**: Việc chuyển đổi từ Entity sang DTO phải được thực hiện ở luồng chính (main thread) để tránh lỗi Hibernate session.

```java
// ProfileService.enrichProfiles
List<CompletableFuture<ProfileResponse>> futures = profiles.stream()
    .map(profile -> {
        ProfileResponse response = profileMapper.toProfileResponse(profile); // Luồng chính
        return CompletableFuture.supplyAsync(() -> enrichWithKeycloak(response)); // Bất đồng bộ
    })
    .toList();
```

### 2. Tổng hợp dữ liệu Dashboard song song (`ReportService`)
Dashboard lấy dữ liệu từ nhiều Repository cùng lúc để giảm độ trễ (latency).

```java
// ReportService.getDashboard
var inventoryFuture = CompletableFuture.supplyAsync(inventoryRepository::findAll);
var ordersFuture = CompletableFuture.supplyAsync(orderRepository::findPending);
var shipmentsFuture = CompletableFuture.supplyAsync(shipmentRepository::findAll);

CompletableFuture.allOf(inventoryFuture, ordersFuture, shipmentsFuture).join();
```

### 3. Xóa Media chạy ngầm (`MediaService`)
Việc xóa các ảnh cũ trên Cloudinary được thực hiện bất đồng bộ để người dùng không phải chờ đợi.

```java
// MediaService
@Async("taskExecutor")
public void deleteProfileMedia(String url) {
    deleteFromCloudinary(url);
}
```

## Các lỗi thường gặp (Common Gotchas)

### 1. Hibernate Lazy Initialization
Hibernate `Session` gắn liền với luồng. Nếu bạn cố gắng truy cập một collection được lazy load (như `profile.getAddresses()`) bên trong một luồng phụ, bạn sẽ gặp lỗi `LazyInitializationException`.

**Giải pháp**: Luôn chuyển đổi Entity sang DTO ở **Luồng chính (Main Thread)** trước khi truyền dữ liệu vào tác vụ bất đồng bộ.

### 2. Ngữ cảnh giao dịch (Transaction Context)
Virtual Threads hoặc các tác vụ Async không kế thừa ngữ cảnh giao dịch của luồng cha. Annotation `@Transactional` mặc định gắn với một luồng duy nhất.

### 3. Trạng thái chia sẻ (Shared State)
Tránh sử dụng các biến global có thể thay đổi trong các Singleton Beans. Sử dụng các cấu trúc dữ liệu thread-safe hoặc biến cục bộ.

### 4. Giám sát (Monitoring)
Sử dụng **Spring Boot Actuator** (`/actuator/metrics`) để theo dõi tình trạng sức khỏe của Thread Pool.

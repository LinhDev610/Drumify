---
name: code-db
description: >-
  Database design and implementation (JPA Entities, Repositories) for Drumify.
  Use this skill when creating or modifying the database schema, writing JPA entities, 
  defining relationships, and creating Spring Data JPA repositories.
  Trigger on: "tạo entity", "thiết kế DB", "database schema", "jpa repository", "quan hệ bảng".
---

# 🗄️ Code DB

Kỹ năng chuyên biệt cho việc quản lý cấu trúc dữ liệu và tương tác database.

## 🛠️ Standards & Patterns

### 1. JPA Entity
-   Sử dụng Lombok (`@Getter`, `@Setter`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`).
-   Sử dụng `@FieldDefaults(level = AccessLevel.PRIVATE)`.
-   Sử dụng `@Table(name = "plural_name")`.
-   Primary Key: Luôn dùng UUID cho các entity chính.
-   Timestamps: Sử dụng `@PrePersist` để tự động gán `createdAt`.

**Example:**
```java
@Getter @Setter @Builder 
@NoArgsConstructor @AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(nullable = false)
    String name;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
```

### 2. Repository
-   Kế thừa `JpaRepository<Entity, IdType>`.
-   Sử dụng Query Methods (ví dụ: `existsByName`) để tối ưu hóa.
-   Hạn chế viết Native Query trừ khi thực sự cần thiết.

## 🚫 Forbidden Actions
-   KHÔNG tạo bảng cho Role/Group/Permission (Identity quản lý bởi Keycloak).
-   KHÔNG để lộ Entity JPA ra Controller.
-   KHÔNG sử dụng `@Data` trên Entity (gây lỗi tuần hoàn với Hibernate).

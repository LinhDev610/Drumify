package com.linhdev.drumify.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import com.linhdev.drumify.enums.StockMovementType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "stock_movements")
// Nhật ký biến động kho
public class StockMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false)
    StockMovementType movementType; // Loại chuyển kho (nhập, xuất, điều chỉnh)

    @Column(nullable = false)
    Integer delta; // Số lượng thay đổi (> 0: nhập, < 0: xuất)

    String reference; // Mã nhận diện (nhập: Mã nhập, xuất: Mã xuất)

    @Column(columnDefinition = "TEXT")
    String note;

    @Column(name = "created_at", nullable = false)
    LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id", nullable = false)
    ProductVariant productVariant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_id")
    Inventory inventory; // Kho chứa sản phẩm

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    Supplier supplier; // Nhà cung cấp (nhập)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    Order relatedOrder; // Đơn hàng liên quan (xuất)

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}

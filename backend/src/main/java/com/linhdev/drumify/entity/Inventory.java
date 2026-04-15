package com.linhdev.drumify.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "inventories")
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "stock_quantity", nullable = false)
    Integer stockQuantity;

    @Column(name = "last_updated", nullable = false)
    LocalDateTime lastUpdated;

    @Column(name = "low_stock_threshold")
    Integer lowStockThreshold; // Ngưỡng cảnh báo tồn kho

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id")
    ProductVariant productVariant;
}

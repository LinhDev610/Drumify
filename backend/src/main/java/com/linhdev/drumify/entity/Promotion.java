package com.linhdev.drumify.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;

import com.linhdev.drumify.enums.DiscountScope;
import com.linhdev.drumify.enums.DiscountStatus;
import com.linhdev.drumify.enums.DiscountType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "promotions")
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(unique = true, nullable = false)
    String code;

    @Column(nullable = false)
    String name;

    String imageUrl;
    String description;

    LocalDate startDate;
    LocalDate expiryDate;

    LocalDateTime submittedAt;
    LocalDateTime approvedAt;
    String rejectionReason;

    @Builder.Default
    Integer usageCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    DiscountStatus status;

    // Discount Value
    Double discountValue;
    Double minOrderValue;
    Double maxDiscountValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_value_type", nullable = false)
    DiscountType discountValueType;

    @Enumerated(EnumType.STRING)
    @Column(name = "apply_scope", nullable = false)
    DiscountScope applyScope;

    // Promotion application scope
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "promotion_categories",
            joinColumns = @JoinColumn(name = "promotion_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    @Builder.Default
    Set<Category> categoryApply = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "promotion_products",
            joinColumns = @JoinColumn(name = "promotion_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id"))
    @Builder.Default
    Set<Product> productApply = new HashSet<>();

    // Loss tracking fields
    @Column(name = "total_loss")
    @Builder.Default
    Double totalLoss = 0.0;

    @Column(name = "loss_threshold")
    Double lossThreshold; // null = no limit
}

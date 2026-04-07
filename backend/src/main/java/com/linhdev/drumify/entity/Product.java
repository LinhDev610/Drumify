package com.linhdev.drumify.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(nullable = false)
    String name;

    String slug;
    Integer soldCount;
    String origin;
    Double weight;
    Double length;
    Double width;
    Double height;

    @Column(columnDefinition = "TEXT")
    String description;

    String shortDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    Profile approvedBy;

    LocalDateTime approvedAt;
    String rejectionReason;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    List<ProductVariant> variant;

    // Product media
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    List<ProductMedia> productMedia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<Review> reviews;

    @ManyToOne(fetch = FetchType.LAZY)
    Brand brand;

    @ManyToMany(mappedBy = "products")
    List<Banner> banners;

    // Promotions
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id")
    Promotion promotion;

    // Vouchers
    @ManyToMany(mappedBy = "productApply", fetch = FetchType.LAZY)
    @Builder.Default
    Set<Voucher> vouchers = new HashSet<>();
}

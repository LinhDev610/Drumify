package com.linhdev.drumify.entity;

import java.util.List;

import jakarta.persistence.*;

import com.linhdev.drumify.enums.ProductStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "product_variants")
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String name;
    Boolean isDefault;

    Double discountValue;
    Double tax;

    @Column(nullable = false)
    Double unitPrice;

    @Column(nullable = false)
    Double purchasePrice;

    @Column(nullable = false)
    Double price;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    ProductStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    Product product;

    @OneToMany(mappedBy = "productVariant")
    List<Inventory> stock;
}

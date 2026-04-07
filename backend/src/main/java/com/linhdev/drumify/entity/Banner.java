package com.linhdev.drumify.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;

import com.linhdev.drumify.enums.ContentType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "banners")
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "title", nullable = false)
    String title;

    @Column(columnDefinition = "TEXT")
    String description;

    String imageUrl;
    String linkUrl;
    ContentType contentType; // 'banner', 'seasonal', 'trending'
    Boolean status;

    Boolean pendingReview;
    Integer orderIndex;
    LocalDate startDate;
    LocalDate endDate;

    String rejectionReason;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    // Products relationship
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "banner_products",
            joinColumns = @JoinColumn(name = "banner_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id"))
    List<Product> products;
}

package com.linhdev.drumify.entity;

import jakarta.persistence.*;

import com.linhdev.drumify.enums.MediaType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "product_medias")
public class ProductMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String mediaUrl;
    MediaType mediaType; // IMAGE, VIDEO, etc.
    boolean isDefault = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    Product product;
}

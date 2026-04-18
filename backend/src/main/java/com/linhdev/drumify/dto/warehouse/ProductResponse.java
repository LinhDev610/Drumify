package com.linhdev.drumify.dto.warehouse;

import java.time.LocalDateTime;
import java.util.List;

import com.linhdev.drumify.dto.response.ProductMediaResponse;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    String id;
    String name;
    String slug;
    String shortDescription;
    String description;
    String origin;
    Double weight;
    Double length;
    Double width;
    Double height;
    String categoryId;
    String categoryName;
    String brandId;
    String brandName;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    List<ProductVariantResponse> variants;
    List<ProductMediaResponse> media;
}

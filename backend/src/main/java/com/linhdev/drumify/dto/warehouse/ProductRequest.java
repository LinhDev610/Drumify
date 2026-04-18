package com.linhdev.drumify.dto.warehouse;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import com.linhdev.drumify.dto.request.ProductMediaRequest;

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
public class ProductRequest {
    @NotBlank
    String name;

    String shortDescription;
    String description;
    String origin;

    @Min(0)
    Double weight;

    @Min(0)
    Double length;

    @Min(0)
    Double width;

    @Min(0)
    Double height;

    String brandId;

    @NotNull
    String categoryId;

    @Valid
    @NotEmpty
    List<ProductVariantRequest> variants;

    List<ProductMediaRequest> media;
}

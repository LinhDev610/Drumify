package com.linhdev.drumify.dto.warehouse;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

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
    Double weight;
    Double length;
    Double width;
    Double height;
    String brandId;

    @NotNull
    String categoryId;

    @Valid
    @NotEmpty
    List<ProductVariantRequest> variants;
}

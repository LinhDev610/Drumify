package com.linhdev.drumify.dto.warehouse;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
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
public class ProductVariantRequest {
    @NotBlank
    String name;

    Boolean isDefault;

    @NotNull
    @Min(0)
    Double purchasePrice;

    @NotNull
    @Min(0)
    Double unitPrice;

    @NotNull
    @Min(0)
    Double price;
}

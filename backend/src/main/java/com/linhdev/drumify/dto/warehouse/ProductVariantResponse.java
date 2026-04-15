package com.linhdev.drumify.dto.warehouse;

import com.linhdev.drumify.enums.ProductStatus;

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
public class ProductVariantResponse {
    String id;
    String name;
    Boolean isDefault;
    Double purchasePrice;
    Double unitPrice;
    Double price;
    ProductStatus status;
}

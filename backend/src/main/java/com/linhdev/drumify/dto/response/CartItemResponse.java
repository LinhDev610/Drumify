package com.linhdev.drumify.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemResponse {
    String id;
    String productId;
    String productName;
    String productSlug;
    String variantId;
    String variantName;
    Double unitPrice;
    Integer quantity;
    Double finalPrice;
}

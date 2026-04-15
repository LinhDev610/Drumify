package com.linhdev.drumify.dto.warehouse;

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
// Du lieu mot dong don hang de render bang trang don hang
public class OrderItemResponse {
    String orderItemId;
    String variantId;
    String productName;
    String variantName;
    Integer quantity;
}

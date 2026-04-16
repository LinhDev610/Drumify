package com.linhdev.drumify.dto.response;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartResponse {
    String id;
    List<CartItemResponse> cartItems;
    Double subtotal;
    String appliedVoucherCode;
    Double voucherDiscount;
    Double totalAmount;
}

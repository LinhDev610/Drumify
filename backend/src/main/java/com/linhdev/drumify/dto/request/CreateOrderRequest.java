package com.linhdev.drumify.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import com.linhdev.drumify.enums.PaymentMethod;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateOrderRequest {
    @NotBlank
    String addressId;

    @NotNull
    PaymentMethod paymentMethod;

    String note;

    Double shippingFee;

    List<String> cartItemIds;
}

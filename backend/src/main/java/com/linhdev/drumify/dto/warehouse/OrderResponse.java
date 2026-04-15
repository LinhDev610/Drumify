package com.linhdev.drumify.dto.warehouse;

import java.time.LocalDateTime;
import java.util.List;

import com.linhdev.drumify.enums.OrderStatus;
import com.linhdev.drumify.enums.PaymentMethod;

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
public class OrderResponse {
    String id;
    String code;
    OrderStatus status;
    String statusCode;
    LocalDateTime orderAt;
    String shippingSummary;
    boolean shipmentCreated;
    String ghnOrderCode;
    PaymentMethod paymentMethod;
    List<OrderItemResponse> items;
}

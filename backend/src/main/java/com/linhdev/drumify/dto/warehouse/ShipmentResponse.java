package com.linhdev.drumify.dto.warehouse;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.linhdev.drumify.enums.ShipmentProvider;
import com.linhdev.drumify.enums.ShipmentStatus;

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
public class ShipmentResponse {
    String id;
    String orderCode;
    String orderId;
    String shippingAddress;
    String ghnOrderCode;
    ShipmentProvider provider;
    ShipmentStatus status;
    LocalDate shippedDate;
    LocalDate estimatedDelivery;
    Long totalFee;
    String trackingNote;
    LocalDateTime createdAt;
}

package com.linhdev.drumify.dto.warehouse;

import java.time.LocalDate;

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
public class ShipmentUpdateRequest {
    String ghnOrderCode;
    ShipmentStatus status;
    ShipmentProvider provider;
    LocalDate shippedDate;
    LocalDate estimatedDelivery;
    Long totalFee;
    String trackingNote;
}

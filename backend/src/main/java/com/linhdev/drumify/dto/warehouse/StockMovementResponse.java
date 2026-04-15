package com.linhdev.drumify.dto.warehouse;

import java.time.LocalDateTime;

import com.linhdev.drumify.enums.StockMovementType;

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
// Nhật ký biến động kho
public class StockMovementResponse {
    String id;
    StockMovementType movementType;
    Integer delta;
    String reference; // Mã nhận diện (nhập: Mã nhập, xuất: Mã xuất)
    String note;
    LocalDateTime createdAt;
    String productName;
    String variantName;
    String supplierName;
    String orderCode;
}

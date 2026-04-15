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
public class ReportResponse {
    long importUnits; // Số lượng nhập kho
    long exportUnits; // Số lượng xuất kho
    long adjustmentDeltaSum; // Tổng số lượng thay đổi (kiểm kê)
    long saleShipUnits; // Số lượng bán hàng / giao đơn
    long movementCount; // Tổng số lượng biến động kho
}

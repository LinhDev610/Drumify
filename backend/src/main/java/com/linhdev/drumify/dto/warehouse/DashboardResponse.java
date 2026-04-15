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
public class DashboardResponse {
    long totalSkuLines; // Tổng số SKU
    long lowStockAlerts; // Số lượng sản phẩm cảnh báo tồn kho
    long ordersAwaitingPack; // Số lượng đơn hàng chờ đóng gói (đã thanh toán, chưa đóng gói)
    long shipmentsInTransit; // Số lượng đơn vị vận chuyển đang di chuyển
}

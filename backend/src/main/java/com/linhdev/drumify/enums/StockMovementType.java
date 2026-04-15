package com.linhdev.drumify.enums;

public enum StockMovementType {
    IMPORT, // Nhập từ NCC
    EXPORT_MANUAL, // Xuất thủ công (hỏng, mất, chuyển nội bộ ...)
    ADJUSTMENT, // Điều chỉnh tồn (+/-)
    SALE_SHIP // Trừ kho do đóng gói giao đơn
}

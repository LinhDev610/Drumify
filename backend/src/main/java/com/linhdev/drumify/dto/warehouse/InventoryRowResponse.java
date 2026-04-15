package com.linhdev.drumify.dto.warehouse;

import java.time.LocalDateTime;

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
// Dữ liệu một dòng tồn kho để render bảng trang tồn kho
public class InventoryRowResponse {
    String inventoryId;
    String productId;
    String productName;
    String variantId;
    String variantName;
    Integer stockQuantity;
    Integer lowStockThreshold;
    boolean lowStock;
    LocalDateTime lastUpdated;
}

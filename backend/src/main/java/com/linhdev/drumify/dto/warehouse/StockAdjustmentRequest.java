package com.linhdev.drumify.dto.warehouse;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

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
// Điều chỉnh tồn kiểm kê (+/-)
public class StockAdjustmentRequest {
    @NotBlank
    String productVariantId;

    @NotNull
    Integer delta; // Số lượng thay đổi (> 0: tăng, < 0: giảm)

    String note;
}

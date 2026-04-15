package com.linhdev.drumify.dto.warehouse;

import jakarta.validation.constraints.Min;
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
// Nhập kho
public class StockImportRequest {
    @NotBlank
    String productVariantId;

    @NotNull
    @Min(1)
    Integer quantity;

    String supplierId;
    String receiptRef; // Mã nhận diện (phiếu nhập)
    String note;
}

package com.linhdev.drumify.controller;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.linhdev.drumify.dto.ApiResponse;
import com.linhdev.drumify.dto.warehouse.InventoryRowResponse;
import com.linhdev.drumify.dto.warehouse.InventoryThresholdRequest;
import com.linhdev.drumify.dto.warehouse.StockAdjustmentRequest;
import com.linhdev.drumify.dto.warehouse.StockExportRequest;
import com.linhdev.drumify.dto.warehouse.StockImportRequest;
import com.linhdev.drumify.dto.warehouse.StockMovementResponse;
import com.linhdev.drumify.service.InventoryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/warehouse")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('GROUP_WAREHOUSE')")
public class InventoryController {
    InventoryService inventoryService;

    @GetMapping("/inventory")
    ApiResponse<List<InventoryRowResponse>> showInventory() {
        return ApiResponse.<List<InventoryRowResponse>>builder()
                .result(inventoryService.listInventory())
                .build();
    }

    @PatchMapping("/inventory/{id}/threshold")
    ApiResponse<InventoryRowResponse> updateThreshold(
            @PathVariable String id, @RequestBody @Valid InventoryThresholdRequest request) {
        return ApiResponse.<InventoryRowResponse>builder()
                .result(inventoryService.updateThreshold(id, request))
                .build();
    }

    @PostMapping("/stock/import")
    ApiResponse<StockMovementResponse> importStock(@RequestBody @Valid StockImportRequest request) {
        return ApiResponse.<StockMovementResponse>builder()
                .result(inventoryService.importStock(request))
                .build();
    }

    @PostMapping("/stock/export")
    ApiResponse<StockMovementResponse> exportStock(@RequestBody @Valid StockExportRequest request) {
        return ApiResponse.<StockMovementResponse>builder()
                .result(inventoryService.exportManual(request))
                .build();
    }

    @PostMapping("/stock/adjust")
    ApiResponse<StockMovementResponse> adjustStock(@RequestBody @Valid StockAdjustmentRequest request) {
        return ApiResponse.<StockMovementResponse>builder()
                .result(inventoryService.adjustStock(request))
                .build();
    }

    @GetMapping("/movements")
    ApiResponse<List<StockMovementResponse>> showMovements(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        LocalDate f = from != null ? from : LocalDate.now().minusDays(30);
        LocalDate t = to != null ? to : LocalDate.now();
        return ApiResponse.<List<StockMovementResponse>>builder()
                .result(inventoryService.listMovements(f, t))
                .build();
    }
}

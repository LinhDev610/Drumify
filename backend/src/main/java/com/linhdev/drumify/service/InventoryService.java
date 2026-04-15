package com.linhdev.drumify.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.linhdev.drumify.dto.warehouse.InventoryRowResponse;
import com.linhdev.drumify.dto.warehouse.InventoryThresholdRequest;
import com.linhdev.drumify.dto.warehouse.StockAdjustmentRequest;
import com.linhdev.drumify.dto.warehouse.StockExportRequest;
import com.linhdev.drumify.dto.warehouse.StockImportRequest;
import com.linhdev.drumify.dto.warehouse.StockMovementResponse;
import com.linhdev.drumify.entity.Inventory;
import com.linhdev.drumify.entity.Order;
import com.linhdev.drumify.entity.OrderItem;
import com.linhdev.drumify.entity.ProductVariant;
import com.linhdev.drumify.entity.StockMovement;
import com.linhdev.drumify.entity.Supplier;
import com.linhdev.drumify.enums.StockMovementType;
import com.linhdev.drumify.exception.AppException;
import com.linhdev.drumify.exception.ErrorCode;
import com.linhdev.drumify.mapper.InventoryMapper;
import com.linhdev.drumify.repository.InventoryRepository;
import com.linhdev.drumify.repository.ProductVariantRepository;
import com.linhdev.drumify.repository.StockMovementRepository;
import com.linhdev.drumify.repository.SupplierRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InventoryService {
    public static final int DEFAULT_LOW_STOCK = 5;

    InventoryRepository inventoryRepository;
    ProductVariantRepository productVariantRepository;
    StockMovementRepository stockMovementRepository;
    SupplierRepository supplierRepository;
    InventoryMapper inventoryMapper;

    public List<InventoryRowResponse> listInventory() {
        return inventoryRepository.findAllWithVariantAndProduct().stream()
                .sorted(Comparator.comparing(
                        i -> i.getProductVariant().getProduct().getName()))
                .map(i -> inventoryMapper.toInventoryRowResponse(i, DEFAULT_LOW_STOCK))
                .collect(Collectors.toList());
    }

    @Transactional
    public InventoryRowResponse updateThreshold(String inventoryId, InventoryThresholdRequest request) {
        Inventory inv = inventoryRepository
                .findById(inventoryId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        inv.setLowStockThreshold(request.getLowStockThreshold());
        inventoryRepository.save(inv);
        return inventoryMapper.toInventoryRowResponse(inv, DEFAULT_LOW_STOCK);
    }

    @Transactional
    public StockMovementResponse importStock(StockImportRequest request) {
        ProductVariant pv = productVariantRepository
                .findById(request.getProductVariantId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
        Supplier supplier = null;
        if (request.getSupplierId() != null && !request.getSupplierId().isBlank()) {
            supplier = supplierRepository
                    .findById(request.getSupplierId())
                    .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        }
        Inventory inv = getOrCreateInventory(pv);
        int qty = request.getQuantity();
        inv.setStockQuantity(inv.getStockQuantity() + qty);
        inv.setLastUpdated(LocalDateTime.now());
        inventoryRepository.save(inv);

        StockMovement m = StockMovement.builder()
                .movementType(StockMovementType.IMPORT)
                .delta(qty)
                .reference(trimToNull(request.getReceiptRef()))
                .note(trimToNull(request.getNote()))
                .productVariant(pv)
                .inventory(inv)
                .supplier(supplier)
                .build();
        stockMovementRepository.save(m);
        return inventoryMapper.toStockMovementResponse(m);
    }

    @Transactional
    public StockMovementResponse exportManual(StockExportRequest request) {
        ProductVariant pv = productVariantRepository
                .findById(request.getProductVariantId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
        Inventory inv = inventoryRepository
                .findFirstByProductVariant_IdOrderByLastUpdatedDesc(pv.getId())
                .orElseThrow(() -> new AppException(ErrorCode.OUT_OF_STOCK));
        int qty = request.getQuantity();
        if (inv.getStockQuantity() < qty) {
            throw new AppException(ErrorCode.OUT_OF_STOCK);
        }
        inv.setStockQuantity(inv.getStockQuantity() - qty);
        inv.setLastUpdated(LocalDateTime.now());
        inventoryRepository.save(inv);

        StockMovement m = StockMovement.builder()
                .movementType(StockMovementType.EXPORT_MANUAL)
                .delta(-qty)
                .reference(trimToNull(request.getReference()))
                .note(trimToNull(request.getNote()))
                .productVariant(pv)
                .inventory(inv)
                .build();
        stockMovementRepository.save(m);
        return inventoryMapper.toStockMovementResponse(m);
    }

    @Transactional
    public StockMovementResponse adjustStock(StockAdjustmentRequest request) {
        if (request.getDelta() == 0) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }
        ProductVariant pv = productVariantRepository
                .findById(request.getProductVariantId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
        Inventory inv = getOrCreateInventory(pv);
        int next = inv.getStockQuantity() + request.getDelta();
        if (next < 0) {
            throw new AppException(ErrorCode.OUT_OF_STOCK);
        }
        inv.setStockQuantity(next);
        inv.setLastUpdated(LocalDateTime.now());
        inventoryRepository.save(inv);

        StockMovement m = StockMovement.builder()
                .movementType(StockMovementType.ADJUSTMENT)
                .delta(request.getDelta())
                .note(trimToNull(request.getNote()))
                .productVariant(pv)
                .inventory(inv)
                .build();
        stockMovementRepository.save(m);
        return inventoryMapper.toStockMovementResponse(m);
    }

    public List<StockMovementResponse> listMovements(LocalDate from, LocalDate to) {
        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.plusDays(1).atStartOfDay();
        return stockMovementRepository.findInRange(start, end).stream()
                .map(inventoryMapper::toStockMovementResponse)
                .collect(Collectors.toList());
    }

    public boolean isLowStock(Inventory i) {
        int th = i.getLowStockThreshold() != null ? i.getLowStockThreshold() : DEFAULT_LOW_STOCK;
        return i.getStockQuantity() <= th;
    }

    public void ensureOrderStockAvailable(Order order) {
        for (OrderItem oi : order.getOrderItem()) {
            ProductVariant pv = oi.getProductVariant();
            Inventory inv = inventoryRepository
                    .findFirstByProductVariant_IdOrderByLastUpdatedDesc(pv.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.OUT_OF_STOCK));
            int need = oi.getQuantity() != null ? oi.getQuantity() : 0;
            if (need <= 0 || inv.getStockQuantity() < need) {
                throw new AppException(ErrorCode.OUT_OF_STOCK);
            }
        }
    }

    @Transactional
    public void consumeStockForOrder(Order order) {
        for (OrderItem oi : order.getOrderItem()) {
            ProductVariant pv = oi.getProductVariant();
            Inventory inv = inventoryRepository
                    .findFirstByProductVariant_IdOrderByLastUpdatedDesc(pv.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.OUT_OF_STOCK));
            int need = oi.getQuantity() != null ? oi.getQuantity() : 0;
            if (inv.getStockQuantity() < need) {
                throw new AppException(ErrorCode.OUT_OF_STOCK);
            }
            inv.setStockQuantity(inv.getStockQuantity() - need);
            inv.setLastUpdated(LocalDateTime.now());
            inventoryRepository.save(inv);
            StockMovement m = StockMovement.builder()
                    .movementType(StockMovementType.SALE_SHIP)
                    .delta(-need)
                    .reference(order.getCode())
                    .productVariant(pv)
                    .inventory(inv)
                    .relatedOrder(order)
                    .build();
            stockMovementRepository.save(m);
        }
    }

    private Inventory getOrCreateInventory(ProductVariant pv) {
        return inventoryRepository
                .findFirstByProductVariant_IdOrderByLastUpdatedDesc(pv.getId())
                .orElseGet(() -> inventoryRepository.save(Inventory.builder()
                        .stockQuantity(0)
                        .lastUpdated(LocalDateTime.now())
                        .productVariant(pv)
                        .build()));
    }

    private String trimToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }
}

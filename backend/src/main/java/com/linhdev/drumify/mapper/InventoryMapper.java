package com.linhdev.drumify.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.linhdev.drumify.dto.warehouse.InventoryRowResponse;
import com.linhdev.drumify.dto.warehouse.StockMovementResponse;
import com.linhdev.drumify.entity.Inventory;
import com.linhdev.drumify.entity.StockMovement;

@Mapper(componentModel = "spring")
public interface InventoryMapper {
    @Mapping(target = "inventoryId", source = "inventory.id")
    @Mapping(target = "productId", source = "inventory.productVariant.product.id")
    @Mapping(target = "productName", source = "inventory.productVariant.product.name")
    @Mapping(target = "variantId", source = "inventory.productVariant.id")
    @Mapping(target = "variantName", source = "inventory.productVariant.name")
    @Mapping(
            target = "lowStockThreshold",
            expression = "java(resolveThreshold(inventory.getLowStockThreshold(), defaultLowStock))")
    @Mapping(
            target = "lowStock",
            expression =
                    "java(inventory.getStockQuantity() <= resolveThreshold(inventory.getLowStockThreshold(), defaultLowStock))")
    InventoryRowResponse toInventoryRowResponse(Inventory inventory, int defaultLowStock);

    @Mapping(target = "productName", source = "productVariant.product.name")
    @Mapping(target = "variantName", source = "productVariant.name")
    @Mapping(
            target = "supplierName",
            expression = "java(movement.getSupplier() != null ? movement.getSupplier().getName() : null)")
    @Mapping(
            target = "orderCode",
            expression = "java(movement.getRelatedOrder() != null ? movement.getRelatedOrder().getCode() : null)")
    StockMovementResponse toStockMovementResponse(StockMovement movement);

    default int resolveThreshold(Integer threshold, int defaultLowStock) {
        return threshold != null ? threshold : defaultLowStock;
    }
}

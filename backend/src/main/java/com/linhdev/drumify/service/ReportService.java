package com.linhdev.drumify.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.linhdev.drumify.dto.warehouse.DashboardResponse;
import com.linhdev.drumify.dto.warehouse.ReportResponse;
import com.linhdev.drumify.entity.StockMovement;
import com.linhdev.drumify.enums.OrderStatus;
import com.linhdev.drumify.enums.ShipmentStatus;
import com.linhdev.drumify.repository.InventoryRepository;
import com.linhdev.drumify.repository.OrderRepository;
import com.linhdev.drumify.repository.ShipmentRepository;
import com.linhdev.drumify.repository.StockMovementRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReportService {
    InventoryRepository inventoryRepository;
    OrderRepository orderRepository;
    ShipmentRepository shipmentRepository;
    StockMovementRepository stockMovementRepository;
    InventoryService inventoryService;

    @PreAuthorize("hasRole('ADMIN') or hasAuthority('GROUP_WAREHOUSE') or hasAuthority('GROUP_CASHIER')")
    public DashboardResponse getDashboard() {
        var inventoryFuture = CompletableFuture.supplyAsync(inventoryRepository::findAllWithVariantAndProduct);
        var pendingOrdersFuture = CompletableFuture.supplyAsync(() -> orderRepository
                .findByStatusInWithItems(List.of(OrderStatus.PAID, OrderStatus.CONFIRMED)));
        var shipmentsFuture = CompletableFuture.supplyAsync(shipmentRepository::findAll);

        CompletableFuture.allOf(inventoryFuture, pendingOrdersFuture, shipmentsFuture)
                .join();

        var rows = inventoryFuture.join();
        long low = rows.stream().filter(inventoryService::isLowStock).count();
        long pending = pendingOrdersFuture.join().size();
        long inTransit = shipmentsFuture.join().stream()
                .filter(s -> s.getStatus() == ShipmentStatus.IN_TRANSIT
                        || s.getStatus() == ShipmentStatus.PICKED_UP
                        || s.getStatus() == ShipmentStatus.CREATED)
                .count();

        return DashboardResponse.builder()
                .totalSkuLines(rows.size())
                .lowStockAlerts(low)
                .ordersAwaitingPack(pending)
                .shipmentsInTransit(inTransit)
                .build();
    }

    @PreAuthorize("hasRole('ADMIN') or hasAuthority('GROUP_WAREHOUSE') or hasAuthority('GROUP_CASHIER')")
    public ReportResponse report(LocalDate from, LocalDate to) {
        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.plusDays(1).atStartOfDay();
        List<StockMovement> list = stockMovementRepository.findInRange(start, end);
        long imp = 0;
        long exp = 0;
        long sale = 0;
        long adjSum = 0;
        for (StockMovement m : list) {
            switch (m.getMovementType()) {
                case IMPORT:
                    imp += m.getDelta();
                    break;
                case EXPORT_MANUAL:
                    exp += Math.abs(m.getDelta());
                    break;
                case SALE_SHIP:
                    sale += Math.abs(m.getDelta());
                    break;
                case ADJUSTMENT:
                    adjSum += m.getDelta();
                    break;
                default:
                    break;
            }
        }
        return ReportResponse.builder()
                .importUnits(imp)
                .exportUnits(exp)
                .saleShipUnits(sale)
                .adjustmentDeltaSum(adjSum)
                .movementCount(list.size())
                .build();
    }
}

package com.linhdev.drumify.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.linhdev.drumify.entity.Order;
import com.linhdev.drumify.enums.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByProfile_ProfileId(String profileId);

    Optional<Order> findByCode(String code);

    // Lấy đơn hàng theo trạng thái.
    @Query("SELECT DISTINCT o FROM Order o "
            + "LEFT JOIN FETCH o.orderItem oi "
            + "LEFT JOIN FETCH oi.productVariant pv "
            + "LEFT JOIN FETCH pv.product "
            + "LEFT JOIN FETCH o.address "
            + "LEFT JOIN FETCH o.payment "
            + "LEFT JOIN FETCH o.shipment "
            + "WHERE o.status IN :statuses ORDER BY o.orderAt DESC")
    List<Order> findByStatusInWithItems(@Param("statuses") Collection<OrderStatus> statuses);

    // Lấy tất cả đơn hàng cho warehouse
    @Query("SELECT DISTINCT o FROM Order o "
            + "LEFT JOIN FETCH o.orderItem oi "
            + "LEFT JOIN FETCH oi.productVariant pv "
            + "LEFT JOIN FETCH pv.product "
            + "LEFT JOIN FETCH o.address "
            + "LEFT JOIN FETCH o.payment "
            + "LEFT JOIN FETCH o.shipment "
            + "ORDER BY o.orderAt DESC")
    List<Order> findAllForWarehouseWithItems();

    // Lấy đơn chi tiết để ship
    @Query("SELECT DISTINCT o FROM Order o "
            + "LEFT JOIN FETCH o.orderItem oi "
            + "LEFT JOIN FETCH oi.productVariant pv "
            + "LEFT JOIN FETCH pv.product "
            + "LEFT JOIN FETCH o.address "
            + "LEFT JOIN FETCH o.payment "
            + "LEFT JOIN FETCH o.shipment "
            + "WHERE o.id = :id")
    Optional<Order> findByIdForWarehouse(@Param("id") String id);
}

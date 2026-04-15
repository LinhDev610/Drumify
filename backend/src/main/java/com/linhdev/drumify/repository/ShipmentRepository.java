package com.linhdev.drumify.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.linhdev.drumify.entity.Shipment;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, String> {

    @Query("SELECT DISTINCT s FROM Shipment s JOIN FETCH s.order o ORDER BY s.id DESC")
    List<Shipment> findAllWithOrder();

    Optional<Shipment> findByOrder_Id(String orderId);

    Optional<Shipment> findByOrderCode(String orderCode);

    Optional<Shipment> findByClientOrderCode(String clientOrderCode);
}

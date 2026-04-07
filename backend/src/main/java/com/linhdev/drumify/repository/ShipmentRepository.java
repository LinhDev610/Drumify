package com.linhdev.drumify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.linhdev.drumify.entity.Shipment;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, String> {}

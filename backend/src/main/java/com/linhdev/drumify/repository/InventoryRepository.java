package com.linhdev.drumify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.linhdev.drumify.entity.Inventory;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, String> {}

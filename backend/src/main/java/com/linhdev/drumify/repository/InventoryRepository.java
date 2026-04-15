package com.linhdev.drumify.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.linhdev.drumify.entity.Inventory;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, String> {

    // Lấy tồn kho và SKU.
    @Query("SELECT i FROM Inventory i JOIN FETCH i.productVariant pv JOIN FETCH pv.product")
    List<Inventory> findAllWithVariantAndProduct();

    // Tìm inventory hiện hành của SKU.
    Optional<Inventory> findFirstByProductVariant_IdOrderByLastUpdatedDesc(String productVariantId);
}

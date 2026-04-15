package com.linhdev.drumify.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.linhdev.drumify.entity.StockMovement;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, String> {

    @Query(
            "SELECT DISTINCT m FROM StockMovement m JOIN FETCH m.productVariant pv JOIN FETCH pv.product LEFT JOIN FETCH m.supplier LEFT JOIN FETCH m.relatedOrder WHERE m.createdAt >= :from AND m.createdAt < :to ORDER BY m.createdAt DESC")
    List<StockMovement> findInRange(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}

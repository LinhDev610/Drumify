package com.linhdev.drumify.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.linhdev.drumify.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByProfile_ProfileId(String profileId);

    Optional<Order> findByCode(String code);
}

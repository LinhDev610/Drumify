package com.linhdev.drumify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.linhdev.drumify.entity.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, String> {}

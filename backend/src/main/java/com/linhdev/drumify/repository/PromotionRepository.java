package com.linhdev.drumify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.linhdev.drumify.entity.Promotion;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, String> {}

package com.linhdev.drumify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.linhdev.drumify.entity.Refund;

@Repository
public interface RefundRepository extends JpaRepository<Refund, String> {}

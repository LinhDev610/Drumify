package com.linhdev.drumify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.linhdev.drumify.entity.Voucher;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, String> {}

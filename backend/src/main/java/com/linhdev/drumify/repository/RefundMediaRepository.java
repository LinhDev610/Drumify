package com.linhdev.drumify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.linhdev.drumify.entity.RefundMedia;

@Repository
public interface RefundMediaRepository extends JpaRepository<RefundMedia, String> {}

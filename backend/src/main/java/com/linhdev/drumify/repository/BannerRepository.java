package com.linhdev.drumify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.linhdev.drumify.entity.Banner;

@Repository
public interface BannerRepository extends JpaRepository<Banner, String> {}

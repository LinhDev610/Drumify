package com.linhdev.drumify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.linhdev.drumify.entity.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, String> {}

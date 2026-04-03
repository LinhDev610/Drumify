package com.linhdev.drumify.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.linhdev.drumify.entity.Profile;

public interface ProfileRepository extends JpaRepository<Profile, String> {
    Optional<Profile> findByUserId(String userId);
}

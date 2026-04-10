package com.linhdev.drumify.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.linhdev.drumify.dto.ApiResponse;
import com.linhdev.drumify.dto.request.RegistrationRequest;
import com.linhdev.drumify.dto.response.ProfileResponse;
import com.linhdev.drumify.service.ProfileService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProfileController {

    ProfileService profileService;

    @Value("${app.sync-secret}")
    @NonFinal
    String syncSecret;

    @PostMapping("/internal/sync")
    ApiResponse<ProfileResponse> syncProfile(
            @RequestHeader("X-Internal-Secret") String secret,
            @RequestParam("userId") String userId,
            @RequestBody RegistrationRequest request) {

        if (!syncSecret.equals(secret)) {
            log.error("Internal sync failed: Invalid secret key from Keycloak");
            throw new RuntimeException("Unauthorized internal access");
        }

        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.syncProfile(request, userId))
                .build();
    }

    @PostMapping("/register")
    ApiResponse<ProfileResponse> register(@RequestBody @Valid RegistrationRequest request) {
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.register(request))
                .build();
    }

    @GetMapping("/my-profile")
    ApiResponse<ProfileResponse> getMyProfile() {
        // Authentication authentication =
        // SecurityContextHolder.getContext().getAuthentication();

        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.getMyProfile())
                .build();
    }

    @GetMapping("/profiles")
    ApiResponse<List<ProfileResponse>> getAllProfiles() {
        return ApiResponse.<List<ProfileResponse>>builder()
                .result(profileService.getAllProfiles())
                .build();
    }
}

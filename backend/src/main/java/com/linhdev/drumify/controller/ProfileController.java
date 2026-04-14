package com.linhdev.drumify.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import com.linhdev.drumify.dto.ApiResponse;
import com.linhdev.drumify.dto.identity.GroupRepresentation;
import com.linhdev.drumify.dto.identity.RoleRepresentation;
import com.linhdev.drumify.dto.request.PasswordChangeRequest;
import com.linhdev.drumify.dto.request.ProfileUpdateRequest;
import com.linhdev.drumify.dto.request.RegistrationRequest;
import com.linhdev.drumify.dto.request.StaffCreationRequest;
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
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.getMyProfile())
                .build();
    }

    @PutMapping("/my-profile")
    ApiResponse<ProfileResponse> updateMyProfile(@RequestBody @Valid ProfileUpdateRequest request) {
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.updateMyProfile(request))
                .build();
    }

    @GetMapping("/profiles")
    ApiResponse<List<ProfileResponse>> getAllProfiles() {
        return ApiResponse.<List<ProfileResponse>>builder()
                .result(profileService.getAllProfiles())
                .build();
    }

    @PutMapping("/my-profile/password")
    ApiResponse<String> changePassword(@RequestBody @Valid PasswordChangeRequest request) {
        profileService.changePassword(request);
        return ApiResponse.<String>builder()
                .result("Password changed successfully")
                .build();
    }

    @PostMapping("/profiles/staff")
    ApiResponse<ProfileResponse> createStaff(@RequestBody @Valid StaffCreationRequest request) {
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.register(request))
                .build();
    }

    @GetMapping("/roles")
    ApiResponse<List<RoleRepresentation>> getRoles() {
        return ApiResponse.<List<RoleRepresentation>>builder()
                .result(profileService.getRoles())
                .build();
    }

    @GetMapping("/groups")
    ApiResponse<List<GroupRepresentation>> getGroups() {
        return ApiResponse.<List<GroupRepresentation>>builder()
                .result(profileService.getGroups())
                .build();
    }

    @PostMapping("/profiles/{userId}/roles")
    ApiResponse<String> assignRoles(@PathVariable String userId, @RequestBody List<RoleRepresentation> roles) {
        profileService.assignRoles(userId, roles);
        return ApiResponse.<String>builder()
                .result("Roles assigned successfully")
                .build();
    }

    @PostMapping("/profiles/{userId}/groups")
    ApiResponse<String> assignGroups(@PathVariable String userId, @RequestBody List<String> groupIds) {
        profileService.assignGroups(userId, groupIds);
        return ApiResponse.<String>builder()
                .result("Groups assigned successfully")
                .build();
    }
}

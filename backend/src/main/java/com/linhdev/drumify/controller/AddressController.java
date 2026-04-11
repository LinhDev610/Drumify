package com.linhdev.drumify.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.linhdev.drumify.dto.ApiResponse;
import com.linhdev.drumify.dto.request.AddressRequest;
import com.linhdev.drumify.dto.response.AddressResponse;
import com.linhdev.drumify.service.ProfileService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/my-profile/addresses")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AddressController {
    ProfileService profileService;

    @PostMapping
    ApiResponse<AddressResponse> addAddress(@RequestBody @Valid AddressRequest request) {
        return ApiResponse.<AddressResponse>builder()
                .result(profileService.addAddress(request))
                .build();
    }

    @PutMapping("/{addressId}")
    ApiResponse<AddressResponse> updateAddress(
            @PathVariable String addressId, @RequestBody @Valid AddressRequest request) {
        return ApiResponse.<AddressResponse>builder()
                .result(profileService.updateAddress(addressId, request))
                .build();
    }

    @DeleteMapping("/{addressId}")
    ApiResponse<Void> deleteAddress(@PathVariable String addressId) {
        profileService.deleteAddress(addressId);
        return ApiResponse.<Void>builder().build();
    }

    @PatchMapping("/{addressId}/default")
    ApiResponse<AddressResponse> setDefaultAddress(@PathVariable String addressId) {
        return ApiResponse.<AddressResponse>builder()
                .result(profileService.setDefaultAddress(addressId))
                .build();
    }
}

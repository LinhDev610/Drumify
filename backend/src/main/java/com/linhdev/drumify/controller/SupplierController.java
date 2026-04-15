package com.linhdev.drumify.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.linhdev.drumify.dto.ApiResponse;
import com.linhdev.drumify.dto.warehouse.SupplierRequest;
import com.linhdev.drumify.dto.warehouse.SupplierResponse;
import com.linhdev.drumify.service.SupplierService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/warehouse")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('GROUP_WAREHOUSE')")
public class SupplierController {
    SupplierService supplierService;

    @GetMapping("/suppliers")
    ApiResponse<List<SupplierResponse>> showSuppliers() {
        return ApiResponse.<List<SupplierResponse>>builder()
                .result(supplierService.listSuppliers())
                .build();
    }

    @PostMapping("/suppliers")
    ApiResponse<SupplierResponse> createSupplier(@RequestBody @Valid SupplierRequest request) {
        return ApiResponse.<SupplierResponse>builder()
                .result(supplierService.createSupplier(request))
                .build();
    }

    @PutMapping("/suppliers/{id}")
    ApiResponse<SupplierResponse> updateSupplier(@PathVariable String id, @RequestBody @Valid SupplierRequest request) {
        return ApiResponse.<SupplierResponse>builder()
                .result(supplierService.updateSupplier(id, request))
                .build();
    }

    @DeleteMapping("/suppliers/{id}")
    ApiResponse<Void> deleteSupplier(@PathVariable String id) {
        supplierService.deactivateSupplier(id);
        return ApiResponse.<Void>builder().build();
    }
}

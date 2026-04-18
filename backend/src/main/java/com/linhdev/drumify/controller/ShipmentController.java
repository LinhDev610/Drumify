package com.linhdev.drumify.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.linhdev.drumify.dto.ApiResponse;
import com.linhdev.drumify.dto.shipment.GhnDistrictResponse;
import com.linhdev.drumify.dto.shipment.GhnProvinceResponse;
import com.linhdev.drumify.dto.shipment.GhnWardResponse;
import com.linhdev.drumify.dto.warehouse.ShipmentResponse;
import com.linhdev.drumify.dto.warehouse.ShipmentUpdateRequest;
import com.linhdev.drumify.service.ShipmentService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShipmentController {
    ShipmentService shipmentService;

    @GetMapping("/ghn/provinces")
    ApiResponse<List<GhnProvinceResponse>> getProvinces() {
        return ApiResponse.<List<GhnProvinceResponse>>builder()
                .result(shipmentService.getProvinces())
                .build();
    }

    @GetMapping("/ghn/districts/{provinceId}")
    ApiResponse<List<GhnDistrictResponse>> getDistricts(@PathVariable int provinceId) {
        return ApiResponse.<List<GhnDistrictResponse>>builder()
                .result(shipmentService.getDistricts(provinceId))
                .build();
    }

    @GetMapping("/ghn/wards/{districtId}")
    ApiResponse<List<GhnWardResponse>> getWards(@PathVariable int districtId) {
        return ApiResponse.<List<GhnWardResponse>>builder()
                .result(shipmentService.getWards(districtId))
                .build();
    }

    @PostMapping("/warehouse/{id}/shipments/create")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('GROUP_WAREHOUSE')")
    ApiResponse<ShipmentResponse> createGhnShipment(@PathVariable String id) {
        return ApiResponse.<ShipmentResponse>builder()
                .result(shipmentService.createGhnShipmentOrder(id))
                .build();
    }

    @GetMapping("/warehouse/shipments")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('GROUP_WAREHOUSE')")
    ApiResponse<List<ShipmentResponse>> showShipments() {
        return ApiResponse.<List<ShipmentResponse>>builder()
                .result(shipmentService.listShipments())
                .build();
    }

    @GetMapping("/warehouse/shipments/order/{orderId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('GROUP_WAREHOUSE')")
    ApiResponse<ShipmentResponse> getShipmentByOrderId(@PathVariable String orderId) {
        return ApiResponse.<ShipmentResponse>builder()
                .result(shipmentService.getShipmentByOrderId(orderId))
                .build();
    }

    @PostMapping("/warehouse/shipments/sync/{orderId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('GROUP_WAREHOUSE')")
    ApiResponse<ShipmentResponse> syncShipmentStatus(@PathVariable String orderId) {
        return ApiResponse.<ShipmentResponse>builder()
                .result(shipmentService.syncOrderStatusFromGhn(orderId))
                .build();
    }

    @PatchMapping("/warehouse/shipments/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('GROUP_WAREHOUSE')")
    ApiResponse<ShipmentResponse> updateShipment(@PathVariable String id, @RequestBody ShipmentUpdateRequest request) {
        return ApiResponse.<ShipmentResponse>builder()
                .result(shipmentService.updateShipment(id, request))
                .build();
    }

    @PostMapping("/ghn/webhook")
    ApiResponse<String> ghnWebhook(
            @RequestHeader(value = "X-Webhook-Secret", required = false) String secret, @RequestBody JsonNode payload) {
        shipmentService.handleGhnWebhook(secret, payload);
        return ApiResponse.<String>builder().result("ok").build();
    }
}

package com.linhdev.drumify.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.linhdev.drumify.dto.ApiResponse;
import com.linhdev.drumify.dto.shipment.GhnDistrictResponse;
import com.linhdev.drumify.dto.shipment.GhnProvinceResponse;
import com.linhdev.drumify.dto.shipment.GhnWardResponse;
import com.linhdev.drumify.service.ShipmentService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/location")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShipmentController {
    ShipmentService shipmentService;

    @GetMapping("/provinces")
    ApiResponse<List<GhnProvinceResponse>> getProvinces() {
        return ApiResponse.<List<GhnProvinceResponse>>builder()
                .result(shipmentService.getProvinces())
                .build();
    }

    @GetMapping("/districts/{provinceId}")
    ApiResponse<List<GhnDistrictResponse>> getDistricts(@PathVariable int provinceId) {
        return ApiResponse.<List<GhnDistrictResponse>>builder()
                .result(shipmentService.getDistricts(provinceId))
                .build();
    }

    @GetMapping("/wards/{districtId}")
    ApiResponse<List<GhnWardResponse>> getWards(@PathVariable int districtId) {
        return ApiResponse.<List<GhnWardResponse>>builder()
                .result(shipmentService.getWards(districtId))
                .build();
    }
}

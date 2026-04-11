package com.linhdev.drumify.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.linhdev.drumify.client.ShipmentClient;
import com.linhdev.drumify.dto.shipment.GhnDistrictResponse;
import com.linhdev.drumify.dto.shipment.GhnProvinceResponse;
import com.linhdev.drumify.dto.shipment.GhnWardResponse;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ShipmentService {
    ShipmentClient shipmentClient;

    @Value("${ghn.token-api}")
    @NonFinal
    String token;

    public List<GhnProvinceResponse> getProvinces() {
        var response = shipmentClient.getProvinces(token);
        if (response.getCode() != 200) {
            log.error("GHN Error: {}", response.getMessage());
            throw new RuntimeException("Cannot fetch provinces from GHN");
        }
        return response.getData();
    }

    public List<GhnDistrictResponse> getDistricts(int provinceId) {
        var response = shipmentClient.getDistricts(token, provinceId);
        if (response.getCode() != 200) {
            log.error("GHN Error: {}", response.getMessage());
            throw new RuntimeException("Cannot fetch districts from GHN for province: " + provinceId);
        }
        return response.getData();
    }

    public List<GhnWardResponse> getWards(int districtId) {
        var response = shipmentClient.getWards(token, districtId);
        if (response.getCode() != 200) {
            log.error("GHN Error: {}", response.getMessage());
            throw new RuntimeException("Cannot fetch wards from GHN for district: " + districtId);
        }
        return response.getData();
    }
}

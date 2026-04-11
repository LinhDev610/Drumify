package com.linhdev.drumify.client;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.linhdev.drumify.dto.shipment.GhnApiResponse;
import com.linhdev.drumify.dto.shipment.GhnDistrictResponse;
import com.linhdev.drumify.dto.shipment.GhnProvinceResponse;
import com.linhdev.drumify.dto.shipment.GhnWardResponse;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShipmentClient {
    RestClient restClient;

    public ShipmentClient(RestClient.Builder restClientBuilder, @Value("${ghn.url}") String baseUrl) {
        this.restClient = restClientBuilder.baseUrl(baseUrl).build();
    }

    public GhnApiResponse<List<GhnProvinceResponse>> getProvinces(String token) {
        return restClient
                .get()
                .uri("/shiip/public-api/master-data/province")
                .header("Token", token)
                .retrieve()
                .body(new ParameterizedTypeReference<GhnApiResponse<List<GhnProvinceResponse>>>() {});
    }

    public GhnApiResponse<List<GhnDistrictResponse>> getDistricts(String token, int provinceId) {
        return restClient
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/shiip/public-api/master-data/district")
                        .queryParam("province_id", provinceId)
                        .build())
                .header("Token", token)
                .retrieve()
                .body(new ParameterizedTypeReference<GhnApiResponse<List<GhnDistrictResponse>>>() {});
    }

    public GhnApiResponse<List<GhnWardResponse>> getWards(String token, int districtId) {
        return restClient
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/shiip/public-api/master-data/ward")
                        .queryParam("district_id", districtId)
                        .build())
                .header("Token", token)
                .retrieve()
                .body(new ParameterizedTypeReference<GhnApiResponse<List<GhnWardResponse>>>() {});
    }
}

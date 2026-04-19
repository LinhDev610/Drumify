package com.linhdev.drumify.client;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.linhdev.drumify.dto.shipment.GhnApiResponse;
import com.linhdev.drumify.dto.shipment.GhnCreateOrderDataResponse;
import com.linhdev.drumify.dto.shipment.GhnCreateOrderRequest;
import com.linhdev.drumify.dto.shipment.GhnDistrictResponse;
import com.linhdev.drumify.dto.shipment.GhnFeeRequest;
import com.linhdev.drumify.dto.shipment.GhnFeeResponse;
import com.linhdev.drumify.dto.shipment.GhnLeadtimeRequest;
import com.linhdev.drumify.dto.shipment.GhnLeadtimeResponse;
import com.linhdev.drumify.dto.shipment.GhnOrderDetailResponse;
import com.linhdev.drumify.dto.shipment.GhnProvinceResponse;
import com.linhdev.drumify.dto.shipment.GhnServiceResponse;
import com.linhdev.drumify.dto.shipment.GhnShiftResponse;
import com.linhdev.drumify.dto.shipment.GhnStationRequest;
import com.linhdev.drumify.dto.shipment.GhnStationResponse;
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

    public GhnApiResponse<GhnCreateOrderDataResponse> createOrder(
            String token, long shopId, GhnCreateOrderRequest request) {
        return restClient
                .post()
                .uri("/shiip/public-api/v2/shipping-order/create")
                .header("Token", token)
                .header("ShopId", String.valueOf(shopId))
                .body(request)
                .retrieve()
                .body(new ParameterizedTypeReference<GhnApiResponse<GhnCreateOrderDataResponse>>() {});
    }

    public GhnApiResponse<GhnOrderDetailResponse> getOrderDetailByOrderCode(
            String token, long shopId, String orderCode) {
        return restClient
                .post()
                .uri("/shiip/public-api/v2/shipping-order/detail")
                .header("Token", token)
                .header("ShopId", String.valueOf(shopId))
                .body(java.util.Map.of("order_code", orderCode))
                .retrieve()
                .body(new ParameterizedTypeReference<GhnApiResponse<GhnOrderDetailResponse>>() {});
    }

    public GhnApiResponse<GhnOrderDetailResponse> getOrderDetailByClientCode(
            String token, long shopId, String clientOrderCode) {
        return restClient
                .post()
                .uri("/shiip/public-api/v2/shipping-order/detail-by-client-code")
                .header("Token", token)
                .header("ShopId", String.valueOf(shopId))
                .body(java.util.Map.of("client_order_code", clientOrderCode))
                .retrieve()
                .body(new ParameterizedTypeReference<GhnApiResponse<GhnOrderDetailResponse>>() {});
    }

    public GhnApiResponse<GhnCreateOrderDataResponse> previewOrder(
            String token, long shopId, GhnCreateOrderRequest request) {
        return restClient
                .post()
                .uri("/shiip/public-api/v2/shipping-order/preview")
                .header("Token", token)
                .header("ShopId", String.valueOf(shopId))
                .body(request)
                .retrieve()
                .body(new ParameterizedTypeReference<GhnApiResponse<GhnCreateOrderDataResponse>>() {});
    }

    public GhnApiResponse<List<GhnShiftResponse>> getShifts(String token) {
        return restClient
                .get()
                .uri("/shiip/public-api/v2/shift/date")
                .header("Token", token)
                .retrieve()
                .body(new ParameterizedTypeReference<GhnApiResponse<List<GhnShiftResponse>>>() {});
    }

    public GhnApiResponse<List<GhnServiceResponse>> getAvailableServices(
            String token, int shopId, int fromDistrict, int toDistrict) {
        return restClient
                .post()
                .uri("/shiip/public-api/v2/shipping-order/available-services")
                .header("Token", token)
                .body(java.util.Map.of(
                        "shop_id", shopId,
                        "from_district", fromDistrict,
                        "to_district", toDistrict))
                .retrieve()
                .body(new ParameterizedTypeReference<GhnApiResponse<List<GhnServiceResponse>>>() {});
    }

    public GhnApiResponse<GhnFeeResponse> calculateFee(String token, int shopId, GhnFeeRequest request) {
        return restClient
                .post()
                .uri("/shiip/public-api/v2/shipping-order/fee")
                .header("Token", token)
                .header("ShopId", String.valueOf(shopId))
                .body(request)
                .retrieve()
                .body(new ParameterizedTypeReference<GhnApiResponse<GhnFeeResponse>>() {});
    }

    public GhnApiResponse<List<GhnStationResponse>> getStations(String token, GhnStationRequest request) {
        return restClient
                .post()
                .uri("/shiip/public-api/v2/station/get")
                .header("Token", token)
                .body(request)
                .retrieve()
                .body(new ParameterizedTypeReference<GhnApiResponse<List<GhnStationResponse>>>() {});
    }

    public GhnApiResponse<GhnLeadtimeResponse> calculateLeadtime(String token, int shopId, GhnLeadtimeRequest request) {
        return restClient
                .post()
                .uri("/shiip/public-api/v2/shipping-order/leadtime")
                .header("Token", token)
                .header("ShopId", String.valueOf(shopId))
                .body(request)
                .retrieve()
                .body(new ParameterizedTypeReference<GhnApiResponse<GhnLeadtimeResponse>>() {});
    }

    public GhnApiResponse<Void> returnOrder(String token, int shopId, List<String> orderCodes) {
        return restClient
                .post()
                .uri("/shiip/public-api/v2/switch-status/return")
                .header("Token", token)
                .header("ShopId", String.valueOf(shopId))
                .body(java.util.Map.of("order_codes", orderCodes))
                .retrieve()
                .body(new ParameterizedTypeReference<GhnApiResponse<Void>>() {});
    }
}

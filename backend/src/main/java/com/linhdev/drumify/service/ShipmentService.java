package com.linhdev.drumify.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientResponseException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.linhdev.drumify.client.ShipmentClient;
import com.linhdev.drumify.dto.shipment.GhnCreateOrderDataResponse;
import com.linhdev.drumify.dto.shipment.GhnCreateOrderRequest;
import com.linhdev.drumify.dto.shipment.GhnDistrictResponse;
import com.linhdev.drumify.dto.shipment.GhnOrderDetailResponse;
import com.linhdev.drumify.dto.shipment.GhnOrderItemRequest;
import com.linhdev.drumify.dto.shipment.GhnProvinceResponse;
import com.linhdev.drumify.dto.shipment.GhnWardResponse;
import com.linhdev.drumify.dto.warehouse.ShipmentResponse;
import com.linhdev.drumify.dto.warehouse.ShipmentUpdateRequest;
import com.linhdev.drumify.entity.Address;
import com.linhdev.drumify.entity.Order;
import com.linhdev.drumify.entity.Payment;
import com.linhdev.drumify.entity.Shipment;
import com.linhdev.drumify.enums.OrderStatus;
import com.linhdev.drumify.enums.PaymentMethod;
import com.linhdev.drumify.enums.ShipmentProvider;
import com.linhdev.drumify.enums.ShipmentStatus;
import com.linhdev.drumify.exception.AppException;
import com.linhdev.drumify.exception.ErrorCode;
import com.linhdev.drumify.mapper.ShipmentMapper;
import com.linhdev.drumify.repository.OrderRepository;
import com.linhdev.drumify.repository.ShipmentRepository;

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
    private static final int GHN_RETRY_MAX_ATTEMPTS = 3;
    private static final int GHN_DEFAULT_DIMENSION = 15;
    private static final int GHN_DEFAULT_WEIGHT = 500;
    private static final int GHN_SERVICE_TYPE_LIGHT = 2;

    ShipmentClient shipmentClient;
    ShipmentRepository shipmentRepository;
    OrderRepository orderRepository;
    ShipmentMapper shipmentMapper;
    InventoryService inventoryService;
    ObjectMapper objectMapper;

    @Value("${ghn.token-api}")
    @NonFinal
    String token;

    @Value("${ghn.shop-id}")
    @NonFinal
    long shopId;

    @Value("${ghn.from-name:Drumify Warehouse}")
    @NonFinal
    String fromName;

    @Value("${ghn.from-phone:0900000000}")
    @NonFinal
    String fromPhone;

    @Value("${ghn.from-address:Kho Drumify}")
    @NonFinal
    String fromAddress;

    @Value("${ghn.from-ward-code:1B2208}")
    @NonFinal
    String fromWardCode;

    @Value("${ghn.from-district-id:1454}")
    @NonFinal
    int fromDistrictId;

    @Value("${ghn.webhook-secret:}")
    @NonFinal
    String ghnSecret;

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

    @Transactional
    public ShipmentResponse createGhnShipmentOrder(String orderId) {
        Order order = orderRepository
                .findByIdForWarehouse(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_EXISTED));
        if (order.getStatus() != OrderStatus.CONFIRMED) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }
        if (order.getOrderItem() == null || order.getOrderItem().isEmpty()) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }
        Optional<Shipment> currentShipment = shipmentRepository.findByOrder_Id(orderId);
        if (currentShipment.isPresent() && currentShipment.get().getOrderCode() != null) {
            return shipmentMapper.toShipmentResponse(currentShipment.get());
        }
        inventoryService.ensureOrderStockAvailable(order);
        GhnCreateOrderDataResponse ghn = createGhnOrderWithRetry(order);

        Shipment shipment = currentShipment.orElseGet(Shipment::new);
        shipment.setOrder(order);
        shipment.setShippingAddress(shipmentMapper.formatAddress(order.getAddress()));
        shipment.setProvider(ShipmentProvider.GHN);
        shipment.setStatus(ShipmentStatus.CREATED);
        shipment.setOrderCode(ghn.getOrderCode());
        shipment.setClientOrderCode(buildClientOrderCode(order));
        shipment.setTotalFee(ghn.getTotalFee());
        shipment.setEstimatedDelivery(parseEstimatedDate(ghn.getExpectedDeliveryTime()));
        shipment.setTrackingNote("GHN order created");
        shipment.setLastSyncAt(LocalDateTime.now());

        inventoryService.consumeStockForOrder(order);
        order.setStatus(OrderStatus.SHIPPED);
        orderRepository.save(order);
        return shipmentMapper.toShipmentResponse(shipmentRepository.save(shipment));
    }

    public List<ShipmentResponse> listShipments() {
        return shipmentRepository.findAllWithOrder().stream()
                .map(shipmentMapper::toShipmentResponse)
                .collect(Collectors.toList());
    }

    public ShipmentResponse getShipmentByOrderId(String orderId) {
        Shipment shipment = shipmentRepository
                .findByOrder_Id(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.SHIPMENT_NOT_EXISTED));
        return shipmentMapper.toShipmentResponse(shipment);
    }

    @Transactional
    public ShipmentResponse updateShipment(String shipmentId, ShipmentUpdateRequest request) {
        Shipment s = shipmentRepository
                .findById(shipmentId)
                .orElseThrow(() -> new AppException(ErrorCode.SHIPMENT_NOT_EXISTED));
        if (request.getGhnOrderCode() != null) s.setOrderCode(request.getGhnOrderCode());
        if (request.getStatus() != null) s.setStatus(request.getStatus());
        if (request.getProvider() != null) s.setProvider(request.getProvider());
        if (request.getShippedDate() != null) s.setShippedDate(request.getShippedDate());
        if (request.getEstimatedDelivery() != null) s.setEstimatedDelivery(request.getEstimatedDelivery());
        if (request.getTotalFee() != null) s.setTotalFee(request.getTotalFee());
        if (request.getTrackingNote() != null) s.setTrackingNote(request.getTrackingNote());
        s.setLastSyncAt(LocalDateTime.now());
        return shipmentMapper.toShipmentResponse(shipmentRepository.save(s));
    }

    @Transactional
    public void handleGhnWebhook(String secret, JsonNode payload) {
        if (ghnSecret != null && !ghnSecret.isBlank() && !ghnSecret.equals(secret)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        String orderCode = readWebhookText(payload, "order_code", "OrderCode", "data.order_code", "Data.OrderCode");
        String status = readWebhookText(payload, "status", "Status", "data.status", "Data.Status");
        if (orderCode == null || orderCode.isBlank() || status == null || status.isBlank()) {
            return;
        }
        Shipment shipment = shipmentRepository.findByOrderCode(orderCode).orElseGet(() -> shipmentRepository
                .findByClientOrderCode(orderCode)
                .orElse(null));
        if (shipment == null) return;

        shipment.setStatus(mapGhnToShipmentStatus(status));
        shipment.setTrackingNote("Webhook update: " + status);
        shipment.setLastSyncAt(LocalDateTime.now());
        shipmentRepository.save(shipment);

        Order order = shipment.getOrder();
        if (order != null) {
            OrderStatus mapped = mapGhnToOrderStatus(status);
            if (mapped != null) {
                order.setStatus(mapped);
                orderRepository.save(order);
            }
        }
    }

    @Transactional
    public ShipmentResponse syncOrderStatusFromGhn(String orderId) {
        Shipment shipment = shipmentRepository
                .findByOrder_Id(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.SHIPMENT_NOT_EXISTED));
        if (shipment.getOrderCode() == null || shipment.getOrderCode().isBlank()) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }
        var detailResponse = shipmentClient.getOrderDetailByOrderCode(token, shopId, shipment.getOrderCode());
        if (detailResponse == null || detailResponse.getCode() != 200 || detailResponse.getData() == null) {
            throw new AppException(ErrorCode.EXTERNAL_SERVICE_ERROR);
        }
        GhnOrderDetailResponse detail = detailResponse.getData();
        String ghnStatus = detail.getStatus();
        if (ghnStatus == null || ghnStatus.isBlank()) {
            throw new AppException(ErrorCode.EXTERNAL_SERVICE_ERROR);
        }
        ShipmentStatus mappedShipmentStatus = mapGhnToShipmentStatus(ghnStatus);
        shipment.setStatus(mappedShipmentStatus);
        shipment.setTrackingNote("Synced from GHN: " + ghnStatus);
        shipment.setLastSyncAt(LocalDateTime.now());
        if (detail.getTotalFee() != null) {
            shipment.setTotalFee(detail.getTotalFee());
        }
        shipmentRepository.save(shipment);

        Order order = shipment.getOrder();
        // Cập nhật status đơn hàng nếu không phải là status trả hàng
        if (order != null && !isReturnFlowStatus(order.getStatus())) {
            OrderStatus mappedOrderStatus = mapGhnToOrderStatus(ghnStatus);
            if (mappedOrderStatus != null) {
                order.setStatus(mappedOrderStatus);
                orderRepository.save(order);
            }
        }
        return shipmentMapper.toShipmentResponse(shipment);
    }

    private boolean isReturnFlowStatus(OrderStatus status) {
        return status == OrderStatus.RETURN_REQUESTED
                || status == OrderStatus.RETURN_CS_CONFIRMED
                || status == OrderStatus.RETURN_STAFF_CONFIRMED
                || status == OrderStatus.RETURN_REJECTED
                || status == OrderStatus.REFUNDED;
    }

    private GhnCreateOrderDataResponse createGhnOrderWithRetry(Order order) {
        String clientOrderCode = buildClientOrderCode(order);
        Exception latestEx = null;
        for (int attempt = 1; attempt <= GHN_RETRY_MAX_ATTEMPTS; attempt++) {
            try {
                GhnCreateOrderRequest request = buildGhnCreateOrderRequest(order, clientOrderCode);
                var response = shipmentClient.createOrder(token, shopId, request);
                if (response != null && response.getCode() == 200 && response.getData() != null) {
                    return response.getData();
                }
                latestEx = new RuntimeException(
                        response != null ? response.getMessage() : "GHN create order response null");
            } catch (RestClientResponseException ex) {
                String errorBody = ex.getResponseBodyAsString();
                log.error("GHN create order client error: {} - Body: {}", ex.getMessage(), errorBody);

                if (ex.getStatusCode().is4xxClientError()) {
                    String ghnMessage = extractGhnErrorMessage(errorBody);
                    throw new AppException(ErrorCode.EXTERNAL_SERVICE_VALIDATION_ERROR, ghnMessage);
                }
                latestEx = ex;
            } catch (Exception ex) {
                latestEx = ex;
            }

            Optional<GhnCreateOrderDataResponse> existed = tryResolveExistedByClientOrderCode(clientOrderCode);
            if (existed.isPresent()) {
                return existed.get();
            }
            sleepBeforeRetry(attempt);
        }
        if (latestEx != null) log.error("GHN create order failed after retries for order {}", order.getId(), latestEx);
        throw new AppException(ErrorCode.EXTERNAL_SERVICE_ERROR);
    }

    private String extractGhnErrorMessage(String errorBody) {
        if (errorBody == null || errorBody.isBlank()) return "Unknown GHN error";
        try {
            JsonNode root = objectMapper.readTree(errorBody);
            if (root.has("code_message_value"))
                return root.get("code_message_value").asText();
            if (root.has("message")) return root.get("message").asText();
        } catch (Exception e) {
            log.warn("Failed to parse GHN error body: {}", errorBody);
        }
        return "GHN Error: " + errorBody;
    }

    private Optional<GhnCreateOrderDataResponse> tryResolveExistedByClientOrderCode(String clientOrderCode) {
        try {
            var detailRes = shipmentClient.getOrderDetailByClientCode(token, shopId, clientOrderCode);
            if (detailRes != null && detailRes.getCode() == 200 && detailRes.getData() != null) {
                GhnOrderDetailResponse detail = detailRes.getData();
                return Optional.of(GhnCreateOrderDataResponse.builder()
                        .orderCode(detail.getOrderCode())
                        .totalFee(detail.getTotalFee())
                        .build());
            }
        } catch (RestClientResponseException ex) {
            if (ex.getStatusCode().is4xxClientError()) {
                log.debug("GHN order not found yet for client code: {}", clientOrderCode);
            } else {
                log.warn("GHN detail-by-client-code failed with status {}: {}", ex.getStatusCode(), ex.getMessage());
            }
        } catch (Exception ex) {
            log.warn("GHN detail-by-client-code failed for {}", clientOrderCode, ex);
        }
        return Optional.empty();
    }

    private void sleepBeforeRetry(int attempt) {
        if (attempt >= GHN_RETRY_MAX_ATTEMPTS) return;
        try {
            Thread.sleep(350L * attempt);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
        }
    }

    private String buildClientOrderCode(Order order) {
        if (order.getCode() != null && !order.getCode().isBlank()) return order.getCode();
        return "DRM-" + order.getId();
    }

    private GhnCreateOrderRequest buildGhnCreateOrderRequest(Order order, String clientOrderCode) {
        Address a = order.getAddress();
        if (a == null || a.getDistrictID() == null || a.getWardCode() == null) {
            throw new AppException(ErrorCode.ADDRESS_NOT_EXISTED);
        }
        List<GhnOrderItemRequest> items = order.getOrderItem().stream()
                .map(oi -> GhnOrderItemRequest.builder()
                        .name(oi.getProductVariant().getProduct().getName() + " - "
                                + oi.getProductVariant().getName())
                        .quantity(oi.getQuantity() != null ? oi.getQuantity() : 1)
                        .price((int) Math.round(oi.getFinalPrice() != null ? oi.getFinalPrice() : oi.getUnitPrice()))
                        .length(toPositiveInt(
                                oi.getProductVariant().getProduct().getLength(), GHN_DEFAULT_DIMENSION))
                        .width(toPositiveInt(oi.getProductVariant().getProduct().getWidth(), GHN_DEFAULT_DIMENSION))
                        .height(toPositiveInt(
                                oi.getProductVariant().getProduct().getHeight(), GHN_DEFAULT_DIMENSION))
                        .weight(toPositiveInt(
                                oi.getProductVariant().getProduct().getWeight(), GHN_DEFAULT_WEIGHT))
                        .build())
                .collect(Collectors.toList());
        long totalCod = 0L;
        Payment payment = order.getPayment();
        if (payment != null && payment.getPaymentMethod() == PaymentMethod.COD && payment.getTotalAmount() != null) {
            totalCod = Math.round(payment.getTotalAmount());
        }
        int totalWeight =
                items.stream().mapToInt(i -> i.getWeight() * i.getQuantity()).sum();
        return GhnCreateOrderRequest.builder()
                .paymentTypeId(totalCod > 0 ? 2 : 1)
                .requiredNote("KHONGCHOXEMHANG")
                .fromName(fromName)
                .fromPhone(fromPhone)
                .fromAddress(fromAddress)
                .fromWardCode(fromWardCode)
                .fromDistrictId(fromDistrictId)
                .toName(a.getRecipientName())
                .toPhone(a.getRecipientPhoneNumber())
                .toAddress(shipmentMapper.formatAddress(a))
                .toWardCode(a.getWardCode())
                .toDistrictId(parseInteger(a.getDistrictID()))
                .codAmount(totalCod)
                .content("Drumify order " + buildClientOrderCode(order))
                .weight(totalWeight > 0 ? totalWeight : GHN_DEFAULT_WEIGHT)
                .length(GHN_DEFAULT_DIMENSION)
                .width(GHN_DEFAULT_DIMENSION)
                .height(Math.max(GHN_DEFAULT_DIMENSION, 10 + items.size() * 2))
                .serviceTypeId(GHN_SERVICE_TYPE_LIGHT)
                .clientOrderCode(clientOrderCode)
                .note(order.getNote())
                .items(items)
                .build();
    }

    private int parseInteger(String value) {
        try {
            return Integer.parseInt(value);
        } catch (Exception e) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }
    }

    private int toPositiveInt(Double value, int fallback) {
        if (value == null || value <= 0) return fallback;
        return Math.max(1, (int) Math.round(value));
    }

    private LocalDate parseEstimatedDate(String expectedDeliveryTime) {
        if (expectedDeliveryTime == null || expectedDeliveryTime.isBlank()) return null;
        try {
            return Instant.parse(expectedDeliveryTime)
                    .atZone(java.time.ZoneId.systemDefault())
                    .toLocalDate();
        } catch (Exception ex) {
            try {
                return LocalDate.parse(expectedDeliveryTime.substring(0, 10));
            } catch (Exception ignore) {
                return null;
            }
        }
    }

    private String readWebhookText(JsonNode payload, String... paths) {
        if (payload == null) return null;
        for (String p : paths) {
            JsonNode node = payload;
            for (String segment : p.split("\\.")) {
                node = node != null ? node.get(segment) : null;
            }
            if (node != null && !node.isNull() && !node.asText("").isBlank()) return node.asText();
        }
        return null;
    }

    private ShipmentStatus mapGhnToShipmentStatus(String statusRaw) {
        String s = statusRaw.toLowerCase();
        if (s.contains("cancel")) return ShipmentStatus.CANCELLED;
        if (s.contains("fail") || s.contains("return")) return ShipmentStatus.FAILED;
        if (s.contains("delivering") || s.contains("transit") || s.contains("sorting"))
            return ShipmentStatus.IN_TRANSIT;
        if (s.contains("pick")) return ShipmentStatus.PICKED_UP;
        if (s.contains("delivered") || s.contains("money_collected")) return ShipmentStatus.DELIVERED;
        return ShipmentStatus.CREATED;
    }

    private OrderStatus mapGhnToOrderStatus(String statusRaw) {
        String s = statusRaw.toLowerCase();
        if (s.contains("delivered") || s.contains("money_collected")) return OrderStatus.DELIVERED;
        if (s.contains("delivering") || s.contains("transit") || s.contains("sorting") || s.contains("pick")) {
            return OrderStatus.SHIPPED;
        }
        if (s.contains("cancel")) return OrderStatus.CANCELLED;
        if (s.contains("ready_to_pick") || s.contains("storing")) return OrderStatus.CONFIRMED;
        return null;
    }
}

package com.linhdev.drumify.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.linhdev.drumify.dto.ApiResponse;
import com.linhdev.drumify.service.ShipmentService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/location/shipments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GhnController {
    ShipmentService shipmentService;

    @PostMapping("/ghn/webhook")
    ApiResponse<String> ghnWebhook(
            @RequestHeader(value = "X-Webhook-Secret", required = false) String secret, @RequestBody JsonNode payload) {
        shipmentService.handleGhnWebhook(secret, payload);
        return ApiResponse.<String>builder().result("ok").build();
    }
}

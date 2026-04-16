package com.linhdev.drumify.controller;

import org.springframework.web.bind.annotation.*;

import com.linhdev.drumify.dto.ApiResponse;
import com.linhdev.drumify.dto.request.CreateOrderRequest;
import com.linhdev.drumify.dto.warehouse.OrderResponse;
import com.linhdev.drumify.service.OrderService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerOrderController {
    OrderService orderService;

    @PostMapping("/checkout")
    ApiResponse<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.createOrder(request))
                .build();
    }
}

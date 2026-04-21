package com.linhdev.drumify.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
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
public class OrderController {
    OrderService orderService;

    @PostMapping("/checkout")
    ApiResponse<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.createOrder(request))
                .build();
    }

    @GetMapping("/my")
    ApiResponse<List<OrderResponse>> getMyOrders() {
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderService.getMyOrders())
                .build();
    }

    @GetMapping("/warehouse/packing")
    ApiResponse<List<OrderResponse>> packingOrders() {
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderService.listOrdersForPacking())
                .build();
    }

    @GetMapping("/internal/list")
    ApiResponse<List<OrderResponse>> getOrdersByStatus(@RequestParam(value = "status", required = false) String status) {
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderService.listOrdersByStatus(status))
                .build();
    }

    @PostMapping("/warehouse/{id}/ship")
    ApiResponse<OrderResponse> createShip(@PathVariable String id) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.shipOrder(id))
                .build();
    }

    @PostMapping("/warehouse/{id}/confirm")
    ApiResponse<OrderResponse> confirmOrder(@PathVariable String id) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.confirmOrder(id))
                .build();
    }

    @PostMapping("/warehouse/{id}/cancel")
    ApiResponse<OrderResponse> cancelOrder(@PathVariable String id) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.cancelOrder(id))
                .build();
    }
}

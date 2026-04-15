package com.linhdev.drumify.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.linhdev.drumify.dto.ApiResponse;
import com.linhdev.drumify.dto.warehouse.OrderResponse;
import com.linhdev.drumify.service.OrderService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/warehouse")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('GROUP_WAREHOUSE')")
public class OrderController {
    OrderService orderService;

    @GetMapping("/orders/packing")
    ApiResponse<List<OrderResponse>> packingOrders() {
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderService.listOrdersForPacking())
                .build();
    }

    @GetMapping("/orders/workflow")
    ApiResponse<List<OrderResponse>> workflowOrders(@RequestParam(value = "status", required = false) String status) {
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderService.listOrdersForWorkflow(status))
                .build();
    }

    @PostMapping("/orders/{id}/ship")
    ApiResponse<OrderResponse> createShip(@PathVariable String id) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.shipOrder(id))
                .build();
    }

    @PostMapping("/orders/{id}/confirm")
    ApiResponse<OrderResponse> confirmOrder(@PathVariable String id) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.confirmOrder(id))
                .build();
    }

    @PostMapping("/orders/{id}/cancel")
    ApiResponse<OrderResponse> cancelOrder(@PathVariable String id) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.cancelOrder(id))
                .build();
    }
}

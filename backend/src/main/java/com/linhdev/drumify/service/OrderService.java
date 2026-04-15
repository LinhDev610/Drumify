package com.linhdev.drumify.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.linhdev.drumify.dto.warehouse.OrderResponse;
import com.linhdev.drumify.entity.Order;
import com.linhdev.drumify.enums.OrderStatus;
import com.linhdev.drumify.exception.AppException;
import com.linhdev.drumify.exception.ErrorCode;
import com.linhdev.drumify.mapper.OrderMapper;
import com.linhdev.drumify.repository.OrderRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderService {
    OrderRepository orderRepository;
    OrderMapper orderMapper;
    ShipmentService shipmentService;

    public List<OrderResponse> listOrdersForPacking() {
        return orderRepository.findByStatusInWithItems(List.of(OrderStatus.PAID, OrderStatus.CONFIRMED)).stream()
                .map(orderMapper::toOrderResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse confirmOrder(String orderId) {
        Order order = orderRepository
                .findByIdForWarehouse(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_EXISTED));
        if (order.getStatus() != OrderStatus.PAID && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);
        return orderMapper.toOrderResponse(order);
    }

    @Transactional
    public OrderResponse shipOrder(String orderId) {
        confirmOrder(orderId);
        shipmentService.createGhnShipmentOrder(orderId);
        Order refreshed = orderRepository
                .findByIdForWarehouse(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_EXISTED));
        return orderMapper.toOrderResponse(refreshed);
    }
}

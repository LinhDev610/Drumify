package com.linhdev.drumify.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.linhdev.drumify.dto.warehouse.OrderResponse;
import com.linhdev.drumify.entity.Address;
import com.linhdev.drumify.entity.Order;
import com.linhdev.drumify.entity.Payment;
import com.linhdev.drumify.enums.OrderStatus;
import com.linhdev.drumify.enums.PaymentMethod;
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
    private static final List<OrderStatus> WAREHOUSE_WORKFLOW_STATUSES = List.of(
            OrderStatus.CREATED,
            OrderStatus.PAID,
            OrderStatus.CONFIRMED,
            OrderStatus.SHIPPED,
            OrderStatus.DELIVERED,
            OrderStatus.CANCELLED);

    OrderRepository orderRepository;
    OrderMapper orderMapper;
    ShipmentService shipmentService;

    public List<OrderResponse> listOrdersForPacking() {
        return orderRepository.findByStatusInWithItems(List.of(OrderStatus.PAID, OrderStatus.CONFIRMED)).stream()
                .map(orderMapper::toOrderResponse)
                .collect(Collectors.toList());
    }

    // Lấy danh sách đơn hàng theo trạng thái
    public List<OrderResponse> listOrdersForWorkflow(String statusCode) {
        List<Order> orders = resolveOrdersByStatus(statusCode);
        return orders.stream().map(orderMapper::toOrderResponse).collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse confirmOrder(String orderId) {
        Order order = orderRepository
                .findByIdForWarehouse(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_EXISTED));
        if (!canConfirm(order)) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }
        validateOrderBeforeConfirm(order);
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);
        return orderMapper.toOrderResponse(order);
    }

    // Xác nhận đơn hàng và tạo đơn vị vận chuyển
    @Transactional
    public OrderResponse shipOrder(String orderId) {
        confirmOrder(orderId);
        shipmentService.createGhnShipmentOrder(orderId);
        Order refreshed = orderRepository
                .findByIdForWarehouse(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_EXISTED));
        return orderMapper.toOrderResponse(refreshed);
    }

    @Transactional
    public OrderResponse cancelOrder(String orderId) {
        Order order = orderRepository
                .findByIdForWarehouse(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_EXISTED));
        if (order.getStatus() == OrderStatus.SHIPPED
                || order.getStatus() == OrderStatus.DELIVERED
                || order.getStatus() == OrderStatus.REFUNDED) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }
        if (order.getStatus() != OrderStatus.CANCELLED) {
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
        }
        return orderMapper.toOrderResponse(order);
    }

    private List<Order> resolveOrdersByStatus(String statusCode) {
        if (statusCode == null || statusCode.isBlank() || "ALL".equalsIgnoreCase(statusCode)) {
            return orderRepository.findByStatusInWithItems(WAREHOUSE_WORKFLOW_STATUSES);
        }
        if ("ACTIVE".equalsIgnoreCase(statusCode)) {
            return orderRepository.findByStatusInWithItems(
                    List.of(OrderStatus.CREATED, OrderStatus.PAID, OrderStatus.CONFIRMED, OrderStatus.SHIPPED));
        }
        try {
            OrderStatus status = OrderStatus.valueOf(statusCode.trim().toUpperCase());
            return orderRepository.findByStatusInWithItems(List.of(status));
        } catch (IllegalArgumentException ex) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }
    }

    private boolean canConfirm(Order order) {
        OrderStatus status = order.getStatus();
        if (status == OrderStatus.PAID || status == OrderStatus.CONFIRMED) {
            return true;
        }
        if (status != OrderStatus.CREATED) {
            return false;
        }
        Payment payment = order.getPayment();
        return payment != null && payment.getPaymentMethod() == PaymentMethod.COD;
    }

    private void validateOrderBeforeConfirm(Order order) {
        if (order.getOrderItem() == null || order.getOrderItem().isEmpty()) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }
        Address address = order.getAddress();
        if (address == null
                || isBlank(address.getRecipientName())
                || isBlank(address.getRecipientPhoneNumber())
                || isBlank(address.getAddress())
                || isBlank(address.getDistrictID())
                || isBlank(address.getWardCode())) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }
        Payment payment = order.getPayment();
        if (payment == null || payment.getPaymentMethod() == null) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }
        if (payment.getPaymentMethod() != PaymentMethod.COD && order.getStatus() == OrderStatus.CREATED) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}

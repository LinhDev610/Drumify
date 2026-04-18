package com.linhdev.drumify.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.linhdev.drumify.dto.warehouse.OrderResponse;
import com.linhdev.drumify.entity.*;
import com.linhdev.drumify.enums.OrderStatus;
import com.linhdev.drumify.enums.PaymentMethod;
import com.linhdev.drumify.exception.AppException;
import com.linhdev.drumify.exception.ErrorCode;
import com.linhdev.drumify.mapper.OrderMapper;
import com.linhdev.drumify.repository.AddressRepository;
import com.linhdev.drumify.repository.OrderItemRepository;
import com.linhdev.drumify.repository.OrderRepository;
import com.linhdev.drumify.repository.PaymentRepository;
import com.linhdev.drumify.repository.ProfileRepository;

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
    CartService cartService;
    ProfileRepository profileRepository;
    AddressRepository addressRepository;
    OrderItemRepository orderItemRepository;
    PaymentRepository paymentRepository;

    @Transactional
    public OrderResponse createOrder(com.linhdev.drumify.dto.request.CreateOrderRequest request) {
        Cart cart = cartService.getOrCreateCartForCurrentProfile();
        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }

        List<CartItem> selectedItems;
        if (request.getCartItemIds() != null && !request.getCartItemIds().isEmpty()) {
            selectedItems = cart.getCartItems().stream()
                    .filter(ci -> request.getCartItemIds().contains(ci.getId()))
                    .collect(Collectors.toList());
        } else {
            selectedItems = cart.getCartItems();
        }

        if (selectedItems.isEmpty()) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }

        Address address = addressRepository
                .findById(request.getAddressId())
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_EXISTED));

        Double subtotal = selectedItems.stream()
                .mapToDouble(ci -> ci.getUnitPrice() * ci.getQuantity())
                .sum();
        Double shippingFee = request.getShippingFee() != null ? request.getShippingFee() : 0;

        Order order = Order.builder()
                .code("ORD-" + System.currentTimeMillis())
                .profile(cart.getProfile())
                .address(address)
                .note(request.getNote())
                .status(OrderStatus.CREATED)
                .orderAt(LocalDateTime.now())
                .subtotal(subtotal)
                .shippingFee(shippingFee)
                .totalAmount(subtotal + shippingFee)
                .build();

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = selectedItems.stream()
                .map(ci -> OrderItem.builder()
                        .order(savedOrder)
                        .productVariant(ci.getProductVariant())
                        .quantity(ci.getQuantity())
                        .unitPrice(ci.getUnitPrice())
                        .finalPrice(ci.getFinalPrice())
                        .build())
                .collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems);
        savedOrder.setOrderItem(orderItems);

        // Remove only selected items from cart
        cart.getCartItems().removeAll(selectedItems);

        // Recalculate cart totals
        Double newSubtotal = cart.getCartItems().stream()
                .mapToDouble(ci -> ci.getUnitPrice() * ci.getQuantity())
                .sum();
        cart.setSubtotal(newSubtotal);
        cart.setTotalAmount(newSubtotal - (cart.getVoucherDiscount() != null ? cart.getVoucherDiscount() : 0));
        if (cart.getTotalAmount() < 0) cart.setTotalAmount(0D);

        // Create initial payment for the order
        Payment payment = Payment.builder()
                .order(savedOrder)
                .paymentMethod(request.getPaymentMethod())
                .totalAmount(savedOrder.getTotalAmount())
                .build();
        paymentRepository.save(payment);
        savedOrder.setPayment(payment);

        return orderMapper.toOrderResponse(savedOrder);
    }

    public List<OrderResponse> getMyOrders() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        Profile profile = profileRepository
                .findByUserId(auth.getName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return orderRepository.findMyOrdersWithItems(profile.getProfileId()).stream()
                .map(orderMapper::toOrderResponse)
                .collect(Collectors.toList());
    }

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

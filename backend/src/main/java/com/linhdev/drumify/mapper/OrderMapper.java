package com.linhdev.drumify.mapper;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.linhdev.drumify.dto.warehouse.OrderItemResponse;
import com.linhdev.drumify.dto.warehouse.OrderResponse;
import com.linhdev.drumify.entity.Address;
import com.linhdev.drumify.entity.Order;
import com.linhdev.drumify.entity.OrderItem;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(target = "orderItemId", source = "id")
    @Mapping(target = "variantId", source = "productVariant.id")
    @Mapping(target = "productName", source = "productVariant.product.name")
    @Mapping(target = "variantName", source = "productVariant.name")
    OrderItemResponse toOrderItemResponse(OrderItem orderItem);

    @Mapping(target = "shippingSummary", expression = "java(formatAddress(order.getAddress()))")
    @Mapping(target = "items", expression = "java(toOrderItemResponses(order.getOrderItem()))")
    @Mapping(target = "statusCode", expression = "java(order.getStatus() != null ? order.getStatus().name() : null)")
    @Mapping(
            target = "paymentMethod",
            expression = "java(order.getPayment() != null ? order.getPayment().getPaymentMethod() : null)")
    @Mapping(
            target = "shipmentCreated",
            expression =
                    "java(order.getShipment() != null && order.getShipment().getOrderCode() != null && !order.getShipment().getOrderCode().isBlank())")
    @Mapping(
            target = "ghnOrderCode",
            expression = "java(order.getShipment() != null ? order.getShipment().getOrderCode() : null)")
    OrderResponse toOrderResponse(Order order);

    default List<OrderItemResponse> toOrderItemResponses(List<OrderItem> items) {
        if (items == null) return List.of();
        return items.stream().map(this::toOrderItemResponse).collect(Collectors.toList());
    }

    default String formatAddress(Address address) {
        if (address == null) return "";
        return String.join(
                ", ",
                Stream.of(
                                address.getAddress(),
                                address.getWardName(),
                                address.getDistrictName(),
                                address.getProvinceName())
                        .filter(Objects::nonNull)
                        .map(String::trim)
                        .filter(x -> !x.isEmpty())
                        .collect(Collectors.toList()));
    }
}

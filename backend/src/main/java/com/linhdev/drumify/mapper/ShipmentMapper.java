package com.linhdev.drumify.mapper;

import java.util.Objects;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.linhdev.drumify.dto.warehouse.ShipmentResponse;
import com.linhdev.drumify.entity.Address;
import com.linhdev.drumify.entity.Shipment;

@Mapper(componentModel = "spring")
public interface ShipmentMapper {
    @Mapping(
            target = "orderCode",
            expression = "java(shipment.getOrder() != null ? shipment.getOrder().getCode() : null)")
    @Mapping(target = "orderId", expression = "java(shipment.getOrder() != null ? shipment.getOrder().getId() : null)")
    @Mapping(target = "ghnOrderCode", source = "orderCode")
    ShipmentResponse toShipmentResponse(Shipment shipment);

    default String formatAddress(Address address) {
        if (address == null) return "";
        return String.join(
                ", ",
                java.util.stream.Stream.of(
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

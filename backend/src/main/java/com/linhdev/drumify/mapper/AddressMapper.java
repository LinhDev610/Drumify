package com.linhdev.drumify.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.linhdev.drumify.dto.request.AddressRequest;
import com.linhdev.drumify.dto.response.AddressResponse;
import com.linhdev.drumify.entity.Address;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    Address toAddress(AddressRequest request);

    AddressResponse toAddressResponse(Address address);

    void updateAddress(@MappingTarget Address address, AddressRequest request);
}

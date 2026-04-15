package com.linhdev.drumify.mapper;

import org.mapstruct.Mapper;

import com.linhdev.drumify.dto.warehouse.SupplierResponse;
import com.linhdev.drumify.entity.Supplier;

@Mapper(componentModel = "spring")
public interface SupplierMapper {
    SupplierResponse toSupplierResponse(Supplier supplier);
}

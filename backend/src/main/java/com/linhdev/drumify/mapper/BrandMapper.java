package com.linhdev.drumify.mapper;

import org.mapstruct.Mapper;

import com.linhdev.drumify.dto.warehouse.BrandResponse;
import com.linhdev.drumify.entity.Brand;

@Mapper(componentModel = "spring")
public interface BrandMapper {
    BrandResponse toBrandResponse(Brand brand);
}

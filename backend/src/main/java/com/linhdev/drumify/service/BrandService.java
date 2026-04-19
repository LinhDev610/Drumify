package com.linhdev.drumify.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.linhdev.drumify.dto.warehouse.BrandRequest;
import com.linhdev.drumify.dto.warehouse.BrandResponse;
import com.linhdev.drumify.entity.Brand;
import com.linhdev.drumify.exception.AppException;
import com.linhdev.drumify.exception.ErrorCode;
import com.linhdev.drumify.mapper.BrandMapper;
import com.linhdev.drumify.repository.BrandRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BrandService {
    BrandRepository brandRepository;
    BrandMapper brandMapper;

    public List<BrandResponse> listBrands() {
        return brandRepository.findAll().stream()
                .map(brandMapper::toBrandResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BrandResponse createBrand(BrandRequest request) {
        if (brandRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.CATEGORY_ALREADY_EXISTS);
        }
        Brand brand = Brand.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .countryOfOrigin(request.getCountryOfOrigin())
                .website(request.getWebsite())
                .active(request.getActive() == null || request.getActive())
                .build();
        return brandMapper.toBrandResponse(brandRepository.save(brand));
    }

    @Transactional
    public BrandResponse updateBrand(String id, BrandRequest request) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        brand.setName(request.getName().trim());
        brand.setDescription(request.getDescription());
        brand.setCountryOfOrigin(request.getCountryOfOrigin());
        brand.setWebsite(request.getWebsite());
        if (request.getActive() != null) {
            brand.setActive(request.getActive());
        }
        return brandMapper.toBrandResponse(brandRepository.save(brand));
    }

    @Transactional
    public void deleteBrand(String id) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        brandRepository.delete(brand);
    }
}

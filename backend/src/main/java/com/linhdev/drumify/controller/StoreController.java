package com.linhdev.drumify.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.linhdev.drumify.dto.ApiResponse;
import com.linhdev.drumify.dto.response.BannerResponse;
import com.linhdev.drumify.dto.warehouse.CategoryResponse;
import com.linhdev.drumify.dto.warehouse.ProductResponse;
import com.linhdev.drumify.service.BannerService;
import com.linhdev.drumify.service.CategoryService;
import com.linhdev.drumify.service.ProductService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/store")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoreController {
    ProductService productService;
    CategoryService categoryService;
    BannerService bannerService;

    @GetMapping("/products")
    ApiResponse<List<ProductResponse>> getProducts() {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.listProducts())
                .build();
    }

    @GetMapping("/products/{slug}")
    ApiResponse<ProductResponse> getProduct(@PathVariable String slug) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.getProductBySlug(slug))
                .build();
    }

    @GetMapping("/categories")
    ApiResponse<List<CategoryResponse>> getCategories() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categoryService.listCategories())
                .build();
    }

    @GetMapping("/banners")
    ApiResponse<List<BannerResponse>> getBanners() {
        return ApiResponse.<List<BannerResponse>>builder()
                .result(bannerService.listBanners())
                .build();
    }
}

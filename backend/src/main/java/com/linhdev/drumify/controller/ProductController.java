package com.linhdev.drumify.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.linhdev.drumify.dto.ApiResponse;
import com.linhdev.drumify.dto.warehouse.ProductRequest;
import com.linhdev.drumify.dto.warehouse.ProductResponse;
import com.linhdev.drumify.service.ProductService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/warehouse")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('GROUP_WAREHOUSE')")
public class ProductController {
    ProductService productService;

    @GetMapping("/products")
    ApiResponse<List<ProductResponse>> showProducts() {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.listProducts())
                .build();
    }

    @PostMapping("/products")
    ApiResponse<ProductResponse> createProduct(@RequestBody @Valid ProductRequest request) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.createProduct(request))
                .build();
    }

    @PutMapping("/products/{id}")
    ApiResponse<ProductResponse> updateProduct(@PathVariable String id, @RequestBody @Valid ProductRequest request) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.updateProduct(id, request))
                .build();
    }

    @DeleteMapping("/products/{id}")
    ApiResponse<String> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ApiResponse.<String>builder().result("Xóa sản phẩm thành công").build();
    }

    @PatchMapping("/products/{id}/status")
    ApiResponse<ProductResponse> updateProductStatus(@PathVariable String id, @RequestParam boolean status) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.updateProductStatus(id, status))
                .build();
    }
}

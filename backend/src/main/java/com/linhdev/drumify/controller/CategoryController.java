package com.linhdev.drumify.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.linhdev.drumify.dto.ApiResponse;
import com.linhdev.drumify.dto.warehouse.CategoryRequest;
import com.linhdev.drumify.dto.warehouse.CategoryResponse;
import com.linhdev.drumify.service.CategoryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/warehouse")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {
    CategoryService categoryService;

    @GetMapping("/categories")
    ApiResponse<List<CategoryResponse>> showCategories() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categoryService.listCategories())
                .build();
    }

    @PostMapping("/categories")
    ApiResponse<CategoryResponse> createCategory(@RequestBody @Valid CategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.createCategory(request))
                .build();
    }

    @PutMapping("/categories/{id}")
    ApiResponse<CategoryResponse> updateCategory(@PathVariable String id, @RequestBody @Valid CategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.updateCategory(id, request))
                .build();
    }

    @PatchMapping("/categories/{id}/status")
    ApiResponse<CategoryResponse> updateCategoryStatus(@PathVariable String id, @RequestParam Boolean status) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.updateCategoryStatus(id, status))
                .build();
    }
}

package com.linhdev.drumify.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.linhdev.drumify.dto.warehouse.CategoryRequest;
import com.linhdev.drumify.dto.warehouse.CategoryResponse;
import com.linhdev.drumify.entity.Category;
import com.linhdev.drumify.exception.AppException;
import com.linhdev.drumify.exception.ErrorCode;
import com.linhdev.drumify.repository.CategoryRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryService {
    CategoryRepository categoryRepository;

    public List<CategoryResponse> listCategories() {
        return categoryRepository.findAllWithParent().stream()
                .map(this::toCategoryResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName().trim())) {
            throw new AppException(ErrorCode.CATEGORY_ALREADY_EXISTS);
        }
        Category parent = null;
        if (request.getParentCategoryId() != null
                && !request.getParentCategoryId().isBlank()) {
            parent = categoryRepository
                    .findById(request.getParentCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        }
        Category c = Category.builder()
                .name(request.getName().trim())
                .description(trimToNull(request.getDescription()))
                .status(request.getStatus() == null || request.getStatus())
                .parentCategory(parent)
                .taxRate(request.getTaxRate())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return toCategoryResponse(categoryRepository.save(c));
    }

    @Transactional
    public CategoryResponse updateCategory(String categoryId, CategoryRequest request) {
        Category c = categoryRepository
                .findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        String nextName = request.getName().trim();
        if (!nextName.equalsIgnoreCase(c.getName()) && categoryRepository.existsByName(nextName)) {
            throw new AppException(ErrorCode.CATEGORY_ALREADY_EXISTS);
        }
        Category parent = null;
        if (request.getParentCategoryId() != null
                && !request.getParentCategoryId().isBlank()) {
            parent = categoryRepository
                    .findById(request.getParentCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
            if (parent.getId().equals(c.getId())) {
                throw new AppException(ErrorCode.BAD_REQUEST);
            }
        }
        c.setName(nextName);
        c.setDescription(trimToNull(request.getDescription()));
        if (request.getStatus() != null) {
            c.setStatus(request.getStatus());
        }
        c.setParentCategory(parent);
        c.setTaxRate(request.getTaxRate());
        c.setUpdatedAt(LocalDateTime.now());
        return toCategoryResponse(categoryRepository.save(c));
    }

    @Transactional
    public CategoryResponse updateCategoryStatus(String categoryId, Boolean status) {
        Category c = categoryRepository
                .findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        c.setStatus(status);
        c.setUpdatedAt(LocalDateTime.now());
        return toCategoryResponse(categoryRepository.save(c));
    }

    private CategoryResponse toCategoryResponse(Category c) {
        return CategoryResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .description(c.getDescription())
                .status(c.getStatus())
                .parentCategoryId(
                        c.getParentCategory() != null ? c.getParentCategory().getId() : null)
                .parentCategoryName(
                        c.getParentCategory() != null ? c.getParentCategory().getName() : null)
                .taxRate(c.getTaxRate())
                .build();
    }

    private String trimToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }
}

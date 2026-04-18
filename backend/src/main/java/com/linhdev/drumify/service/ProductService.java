package com.linhdev.drumify.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.linhdev.drumify.dto.request.ProductMediaRequest;
import com.linhdev.drumify.dto.response.ProductMediaResponse;
import com.linhdev.drumify.dto.warehouse.ProductRequest;
import com.linhdev.drumify.dto.warehouse.ProductResponse;
import com.linhdev.drumify.dto.warehouse.ProductVariantRequest;
import com.linhdev.drumify.dto.warehouse.ProductVariantResponse;
import com.linhdev.drumify.entity.Brand;
import com.linhdev.drumify.entity.Category;
import com.linhdev.drumify.entity.Product;
import com.linhdev.drumify.entity.ProductMedia;
import com.linhdev.drumify.entity.ProductVariant;
import com.linhdev.drumify.enums.ProductStatus;
import com.linhdev.drumify.exception.AppException;
import com.linhdev.drumify.exception.ErrorCode;
import com.linhdev.drumify.repository.BrandRepository;
import com.linhdev.drumify.repository.CategoryRepository;
import com.linhdev.drumify.repository.ProductRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {
    ProductRepository productRepository;
    CategoryRepository categoryRepository;
    BrandRepository brandRepository;

    public List<ProductResponse> listProducts() {
        return productRepository.findAllForWarehouse().stream()
                .map(this::toProductResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductBySlug(String slug) {
        Product product =
                productRepository.findBySlug(slug).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
        return toProductResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        Brand brand = null;
        if (request.getBrandId() != null && !request.getBrandId().isBlank()) {
            brand = brandRepository.findById(request.getBrandId()).orElse(null);
        }
        Product product = Product.builder()
                .name(request.getName().trim())
                .slug(generateUniqueProductSlug(request.getName(), null))
                .shortDescription(trimToNull(request.getShortDescription()))
                .description(trimToNull(request.getDescription()))
                .origin(trimToNull(request.getOrigin()))
                .weight(request.getWeight())
                .length(request.getLength())
                .width(request.getWidth())
                .height(request.getHeight())
                .category(category)
                .brand(brand)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .variant(new ArrayList<>())
                .productMedia(new ArrayList<>())
                .build();
        applyVariants(product, request.getVariants());
        applyMedia(product, request.getMedia());
        return toProductResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(String productId, ProductRequest request) {
        Product product = productRepository
                .findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        Brand brand = null;
        if (request.getBrandId() != null && !request.getBrandId().isBlank()) {
            brand = brandRepository.findById(request.getBrandId()).orElse(null);
        }
        product.setName(request.getName().trim());
        product.setSlug(generateUniqueProductSlug(request.getName(), product.getId()));
        product.setShortDescription(trimToNull(request.getShortDescription()));
        product.setDescription(trimToNull(request.getDescription()));
        product.setOrigin(trimToNull(request.getOrigin()));
        product.setWeight(request.getWeight());
        product.setLength(request.getLength());
        product.setWidth(request.getWidth());
        product.setHeight(request.getHeight());
        product.setCategory(category);
        product.setBrand(brand);
        product.setUpdatedAt(LocalDateTime.now());
        applyVariants(product, request.getVariants());
        applyMedia(product, request.getMedia());
        return toProductResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(String productId) {
        Product product = productRepository
                .findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
        productRepository.delete(product);
    }

    @Transactional
    public ProductResponse updateProductStatus(String productId, boolean status) {
        ProductStatus targetStatus = status ? ProductStatus.APPROVED : ProductStatus.HIDDEN;
        Product product = productRepository
                .findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
        if (product.getVariant() != null) {
            product.getVariant().forEach(v -> v.setStatus(targetStatus));
        }
        product.setUpdatedAt(LocalDateTime.now());
        return toProductResponse(productRepository.save(product));
    }

    private ProductResponse toProductResponse(Product p) {
        List<ProductVariantResponse> variants = p.getVariant() == null
                ? List.of()
                : p.getVariant().stream()
                        .map(v -> ProductVariantResponse.builder()
                                .id(v.getId())
                                .name(v.getName())
                                .isDefault(v.getIsDefault())
                                .purchasePrice(v.getPurchasePrice())
                                .unitPrice(v.getUnitPrice())
                                .price(v.getPrice())
                                .status(v.getStatus())
                                .build())
                        .collect(Collectors.toList());
        List<ProductMediaResponse> media = p.getProductMedia() == null
                ? List.of()
                : p.getProductMedia().stream()
                        .map(m -> ProductMediaResponse.builder()
                                .id(m.getId())
                                .mediaUrl(m.getMediaUrl())
                                .mediaType(m.getMediaType())
                                .isDefault(m.isDefault())
                                .build())
                        .collect(Collectors.toList());

        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .slug(p.getSlug())
                .shortDescription(p.getShortDescription())
                .description(p.getDescription())
                .origin(p.getOrigin())
                .weight(p.getWeight())
                .length(p.getLength())
                .width(p.getWidth())
                .height(p.getHeight())
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .brandId(p.getBrand() != null ? p.getBrand().getId() : null)
                .brandName(p.getBrand() != null ? p.getBrand().getName() : null)
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .variants(variants)
                .build();
    }

    private void applyVariants(Product product, List<ProductVariantRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }
        if (product.getVariant() == null) {
            product.setVariant(new ArrayList<>());
        } else {
            product.getVariant().clear();
        }
        boolean hasDefault = requests.stream().anyMatch(v -> Boolean.TRUE.equals(v.getIsDefault()));
        int idx = 0;
        for (ProductVariantRequest vr : requests) {
            ProductVariant v = ProductVariant.builder()
                    .name(vr.getName().trim())
                    .isDefault(Boolean.TRUE.equals(vr.getIsDefault()) || (!hasDefault && idx == 0))
                    .purchasePrice(vr.getPurchasePrice())
                    .unitPrice(vr.getUnitPrice())
                    .price(vr.getPrice())
                    .discountValue(0D)
                    .tax(0D)
                    .status(ProductStatus.APPROVED)
                    .product(product)
                    .build();
            product.getVariant().add(v);
            idx++;
        }
    }

    private void applyMedia(Product product, List<ProductMediaRequest> requests) {
        if (product.getProductMedia() == null) {
            product.setProductMedia(new ArrayList<>());
        } else {
            product.getProductMedia().clear();
        }
        if (requests == null || requests.isEmpty()) return;

        for (ProductMediaRequest mr : requests) {
            ProductMedia m = ProductMedia.builder()
                    .mediaUrl(mr.getMediaUrl().trim())
                    .mediaType(mr.getMediaType())
                    .isDefault(mr.isDefault())
                    .product(product)
                    .build();
            product.getProductMedia().add(m);
        }
    }

    private String generateUniqueProductSlug(String name, String currentProductId) {
        String base = slugify(name);
        String slug = base;
        int idx = 1;
        while (true) {
            Optional<Product> existed = productRepository.findBySlug(slug);
            if (existed.isEmpty()
                    || (currentProductId != null && existed.get().getId().equals(currentProductId))) {
                return slug;
            }
            slug = base + "-" + idx++;
        }
    }

    private String slugify(String input) {
        String normalized = input == null ? "" : input.toLowerCase(Locale.ROOT).trim();
        normalized = normalized.replaceAll("[^a-z0-9\\s-]", "");
        normalized = normalized.replaceAll("\\s+", "-");
        normalized = normalized.replaceAll("-+", "-");
        if (normalized.isBlank()) {
            return "product";
        }
        return normalized;
    }

    private String trimToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }
}

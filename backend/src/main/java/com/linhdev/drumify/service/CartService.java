package com.linhdev.drumify.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.linhdev.drumify.dto.response.CartItemResponse;
import com.linhdev.drumify.dto.response.CartResponse;
import com.linhdev.drumify.entity.Cart;
import com.linhdev.drumify.entity.CartItem;
import com.linhdev.drumify.entity.ProductVariant;
import com.linhdev.drumify.entity.Profile;
import com.linhdev.drumify.exception.AppException;
import com.linhdev.drumify.exception.ErrorCode;
import com.linhdev.drumify.repository.CartItemRepository;
import com.linhdev.drumify.repository.CartRepository;
import com.linhdev.drumify.repository.ProductVariantRepository;
import com.linhdev.drumify.repository.ProfileRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartService {
    CartRepository cartRepository;
    CartItemRepository cartItemRepository;
    ProfileRepository profileRepository;
    ProductVariantRepository productVariantRepository;

    @Transactional
    public Cart getOrCreateCartForCurrentProfile() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        Profile profile =
                profileRepository.findByUserId(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return cartRepository
                .findByProfile_ProfileId(profile.getProfileId())
                .orElseGet(() -> cartRepository.save(Cart.builder()
                        .profile(profile)
                        .subtotal(0D)
                        .voucherDiscount(0D)
                        .totalAmount(0D)
                        .build()));
    }

    public CartResponse getCart() {
        Cart cart = getOrCreateCartForCurrentProfile();
        return toCartResponse(cart);
    }

    @Transactional
    public CartResponse addItem(String variantId, Integer quantity) {
        if (quantity <= 0) throw new AppException(ErrorCode.BAD_REQUEST);

        Cart cart = getOrCreateCartForCurrentProfile();
        ProductVariant variant = productVariantRepository
                .findById(variantId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));

        CartItem cartItem = cartItemRepository
                .findByCart_IdAndProductVariant_Id(cart.getId(), variantId)
                .orElse(CartItem.builder()
                        .cart(cart)
                        .productVariant(variant)
                        .unitPrice(variant.getPrice())
                        .quantity(0)
                        .build());

        cartItem.setQuantity(cartItem.getQuantity() + quantity);
        cartItem.setFinalPrice(cartItem.getQuantity() * cartItem.getUnitPrice());
        cartItemRepository.save(cartItem);

        recalculateCart(cart);
        return toCartResponse(cart);
    }

    @Transactional
    public CartResponse updateItemQuantity(String itemId, Integer quantity) {
        if (quantity <= 0) return removeItem(itemId);

        Cart cart = getOrCreateCartForCurrentProfile();
        CartItem cartItem = cartItemRepository
                .findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_EXISTED));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        cartItem.setQuantity(quantity);
        cartItem.setFinalPrice(cartItem.getQuantity() * cartItem.getUnitPrice());
        cartItemRepository.save(cartItem);

        recalculateCart(cart);
        return toCartResponse(cart);
    }

    @Transactional
    public CartResponse removeItem(String itemId) {
        Cart cart = getOrCreateCartForCurrentProfile();
        CartItem cartItem = cartItemRepository
                .findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_EXISTED));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        cartItemRepository.delete(cartItem);

        if (cart.getCartItems() != null) {
            cart.getCartItems().removeIf(item -> item.getId().equals(itemId));
        }

        recalculateCart(cart);
        return toCartResponse(cart);
    }

    private void recalculateCart(Cart cart) {
        double subtotal = 0;
        if (cart.getCartItems() != null) {
            subtotal = cart.getCartItems().stream()
                    .mapToDouble(item -> item.getFinalPrice() != null ? item.getFinalPrice() : 0)
                    .sum();
        }
        cart.setSubtotal(subtotal);
        double voucherDiscount = cart.getVoucherDiscount() != null ? cart.getVoucherDiscount() : 0;
        cart.setTotalAmount(Math.max(0, subtotal - voucherDiscount));
        cartRepository.save(cart);
    }

    private CartResponse toCartResponse(Cart cart) {
        List<CartItemResponse> items = cart.getCartItems() == null
                ? new ArrayList<>()
                : cart.getCartItems().stream()
                        .map(item -> CartItemResponse.builder()
                                .id(item.getId())
                                .productId(item.getProductVariant().getProduct().getId())
                                .productName(
                                        item.getProductVariant().getProduct().getName())
                                .productSlug(
                                        item.getProductVariant().getProduct().getSlug())
                                .variantId(item.getProductVariant().getId())
                                .variantName(item.getProductVariant().getName())
                                .unitPrice(item.getUnitPrice())
                                .quantity(item.getQuantity())
                                .finalPrice(item.getFinalPrice())
                                .build())
                        .collect(Collectors.toList());

        return CartResponse.builder()
                .id(cart.getId())
                .cartItems(items)
                .subtotal(cart.getSubtotal())
                .appliedVoucherCode(cart.getAppliedVoucherCode())
                .voucherDiscount(cart.getVoucherDiscount())
                .totalAmount(cart.getTotalAmount())
                .build();
    }
}

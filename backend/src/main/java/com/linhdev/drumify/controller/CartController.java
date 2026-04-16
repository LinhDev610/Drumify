package com.linhdev.drumify.controller;

import org.springframework.web.bind.annotation.*;

import com.linhdev.drumify.dto.ApiResponse;
import com.linhdev.drumify.dto.response.CartResponse;
import com.linhdev.drumify.service.CartService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartController {
    CartService cartService;

    @GetMapping
    ApiResponse<CartResponse> getCart() {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.getCart())
                .build();
    }

    @PostMapping("/items")
    ApiResponse<CartResponse> addItem(
            @RequestParam String variantId, 
            @RequestParam Integer quantity) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.addItem(variantId, quantity))
                .build();
    }

    @PutMapping("/items/{itemId}")
    ApiResponse<CartResponse> updateItemQuantity(
            @PathVariable String itemId, 
            @RequestParam Integer quantity) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.updateItemQuantity(itemId, quantity))
                .build();
    }

    @DeleteMapping("/items/{itemId}")
    ApiResponse<CartResponse> removeItem(@PathVariable String itemId) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.removeItem(itemId))
                .build();
    }
}

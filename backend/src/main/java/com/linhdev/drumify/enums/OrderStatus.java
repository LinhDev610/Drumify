package com.linhdev.drumify.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum OrderStatus {
    CREATED("Created"),
    CONFIRMED("Confirmed"),
    PAID("Paid"),
    SHIPPED("Shipping"),
    DELIVERED("Delivered"),
    CANCELLED("Cancelled"),
    RETURN_REQUESTED("Return Requested"),
    RETURN_CS_CONFIRMED("Customer Service Confirmed Return"),
    RETURN_STAFF_CONFIRMED("Staff Confirmed Return"),
    REFUNDED("Refunded"),
    RETURN_REJECTED("Return Rejected");

    private final String displayName;

    OrderStatus(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static OrderStatus fromString(String value) {
        if (value == null) {
            return null;
        }
        // Tìm theo displayName (tiếng Việt)
        for (OrderStatus status : OrderStatus.values()) {
            if (status.getDisplayName().equals(value)) {
                return status;
            }
        }
        try {
            return OrderStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}

package com.linhdev.drumify.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum MediaType {
    IMAGE("Image"),
    VIDEO("Video");

    private final String displayName;

    MediaType(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static MediaType fromString(String value) {
        if (value == null) {
            return null;
        }
        // Tìm theo displayName (tiếng Việt)
        for (MediaType status : MediaType.values()) {
            if (status.getDisplayName().equals(value)) {
                return status;
            }
        }
        try {
            return MediaType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}

package com.linhdev.drumify.dto.shipment;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GhnApiResponse<T> {
    @JsonProperty("code")
    int code;

    @JsonProperty("message")
    String message;

    @JsonProperty("data")
    T data;
}

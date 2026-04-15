package com.linhdev.drumify.dto.shipment;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GhnOrderItemRequest {
    @JsonProperty("name")
    String name;

    @JsonProperty("quantity")
    Integer quantity;

    @JsonProperty("price")
    Integer price;

    @JsonProperty("length")
    Integer length;

    @JsonProperty("width")
    Integer width;

    @JsonProperty("height")
    Integer height;

    @JsonProperty("weight")
    Integer weight;
}

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
public class GhnCreateOrderDataResponse {
    @JsonProperty("order_code")
    String orderCode;

    @JsonProperty("total_fee")
    Long totalFee;

    @JsonProperty("expected_delivery_time")
    String expectedDeliveryTime;

    @JsonProperty("sort_code")
    String sortCode;
}

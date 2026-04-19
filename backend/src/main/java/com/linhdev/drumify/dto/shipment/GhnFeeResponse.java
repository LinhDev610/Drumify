package com.linhdev.drumify.dto.shipment;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GhnFeeResponse {
    @JsonProperty("total")
    long total;

    @JsonProperty("service_fee")
    long serviceFee;

    @JsonProperty("insurance_fee")
    long insuranceFee;

    @JsonProperty("coupon_value")
    long couponValue;
}

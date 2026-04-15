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
public class GhnOrderDetailResponse {
    @JsonProperty("order_code")
    String orderCode;

    @JsonProperty("client_order_code")
    String clientOrderCode;

    @JsonProperty("status")
    String status;

    @JsonProperty("total_fee")
    Long totalFee;
}

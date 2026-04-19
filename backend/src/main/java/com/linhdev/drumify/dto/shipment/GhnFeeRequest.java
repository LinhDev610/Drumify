package com.linhdev.drumify.dto.shipment;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GhnFeeRequest {
    @JsonProperty("service_type_id")
    Integer serviceTypeId;

    @JsonProperty("service_id")
    Integer serviceId;

    @JsonProperty("from_district_id")
    Integer fromDistrictId;

    @JsonProperty("to_district_id")
    Integer toDistrictId;

    @JsonProperty("to_ward_code")
    String toWardCode;

    @JsonProperty("height")
    Integer height;

    @JsonProperty("length")
    Integer length;

    @JsonProperty("weight")
    Integer weight;

    @JsonProperty("width")
    Integer width;

    @JsonProperty("insurance_value")
    Long insuranceValue;

    @JsonProperty("coupon")
    String coupon;
}

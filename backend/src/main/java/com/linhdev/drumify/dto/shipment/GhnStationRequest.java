package com.linhdev.drumify.dto.shipment;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GhnStationRequest {
    @JsonProperty("district_id")
    int districtId;

    @JsonProperty("ward_code")
    String wardCode;

    @JsonProperty("offset")
    int offset;

    @JsonProperty("limit")
    int limit;
}

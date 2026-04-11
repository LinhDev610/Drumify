package com.linhdev.drumify.dto.shipment;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GhnWardResponse {
    @JsonProperty("WardCode")
    String wardCode;

    @JsonProperty("WardName")
    String wardName;

    @JsonProperty("DistrictID")
    int districtID;
}

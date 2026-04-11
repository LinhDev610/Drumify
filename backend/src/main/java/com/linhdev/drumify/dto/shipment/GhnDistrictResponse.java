package com.linhdev.drumify.dto.shipment;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GhnDistrictResponse {
    @JsonProperty("DistrictID")
    int districtID;

    @JsonProperty("DistrictName")
    String districtName;

    @JsonProperty("ProvinceID")
    int provinceID;
}

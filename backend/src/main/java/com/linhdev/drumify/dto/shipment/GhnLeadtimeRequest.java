package com.linhdev.drumify.dto.shipment;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GhnLeadtimeRequest {
    @JsonProperty("from_district_id")
    int fromDistrictId;

    @JsonProperty("from_ward_code")
    String fromWardCode;

    @JsonProperty("to_district_id")
    int toDistrictId;

    @JsonProperty("to_ward_code")
    String toWardCode;

    @JsonProperty("service_id")
    Integer serviceId;

    @JsonProperty("service_type_id")
    Integer serviceTypeId;
}

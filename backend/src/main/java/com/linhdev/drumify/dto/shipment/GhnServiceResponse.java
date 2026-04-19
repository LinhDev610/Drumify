package com.linhdev.drumify.dto.shipment;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GhnServiceResponse {
    @JsonProperty("service_id")
    int serviceId;

    @JsonProperty("short_name")
    String shortName;

    @JsonProperty("service_type_id")
    int serviceTypeId;
}

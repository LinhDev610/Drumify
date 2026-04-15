package com.linhdev.drumify.dto.shipment;

import java.util.List;

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
public class GhnCreateOrderRequest {
    @JsonProperty("payment_type_id")
    Integer paymentTypeId;

    @JsonProperty("required_note")
    String requiredNote;

    @JsonProperty("from_name")
    String fromName;

    @JsonProperty("from_phone")
    String fromPhone;

    @JsonProperty("from_address")
    String fromAddress;

    @JsonProperty("from_ward_code")
    String fromWardCode;

    @JsonProperty("from_district_id")
    Integer fromDistrictId;

    @JsonProperty("to_name")
    String toName;

    @JsonProperty("to_phone")
    String toPhone;

    @JsonProperty("to_address")
    String toAddress;

    @JsonProperty("to_ward_code")
    String toWardCode;

    @JsonProperty("to_district_id")
    Integer toDistrictId;

    @JsonProperty("cod_amount")
    Long codAmount;

    @JsonProperty("content")
    String content;

    @JsonProperty("weight")
    Integer weight;

    @JsonProperty("length")
    Integer length;

    @JsonProperty("width")
    Integer width;

    @JsonProperty("height")
    Integer height;

    @JsonProperty("service_type_id")
    Integer serviceTypeId;

    @JsonProperty("client_order_code")
    String clientOrderCode;

    @JsonProperty("note")
    String note;

    @JsonProperty("items")
    List<GhnOrderItemRequest> items;
}

package com.linhdev.drumify.dto.response;

import java.time.LocalDateTime;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddressResponse {
    String id;
    String recipientName;
    String recipientPhoneNumber;
    String country;
    String provinceID;
    String provinceName;
    String districtID;
    String districtName;
    String wardCode;
    String wardName;
    String address;
    String postalCode;
    boolean defaultAddress;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

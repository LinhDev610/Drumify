package com.linhdev.drumify.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddressRequest {
    @NotBlank(message = "Recipient name is required")
    String recipientName;

    @NotBlank(message = "Recipient phone number is required")
    String recipientPhoneNumber;

    String country;

    @NotBlank(message = "Province ID is required")
    String provinceID;

    @NotBlank(message = "Province name is required")
    String provinceName;

    @NotBlank(message = "District ID is required")
    String districtID;

    @NotBlank(message = "District name is required")
    String districtName;

    @NotBlank(message = "Ward code is required")
    String wardCode;

    @NotBlank(message = "Ward name is required")
    String wardName;

    @NotBlank(message = "Detailed address is required")
    String address;

    String postalCode;
    boolean defaultAddress;
}

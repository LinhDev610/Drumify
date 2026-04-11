package com.linhdev.drumify.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddressRequest {
    @NotBlank(message = "Recipient name is required")
    @Size(max = 50, message = "Recipient name cannot exceed 50 characters")
    String recipientName;

    @NotBlank(message = "Recipient phone number is required")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone number must be 10 or 11 digits")
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
    @Size(max = 255, message = "Detailed address cannot exceed 255 characters")
    String address;

    String postalCode;
    boolean defaultAddress;
}

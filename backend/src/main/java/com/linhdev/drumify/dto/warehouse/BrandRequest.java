package com.linhdev.drumify.dto.warehouse;

import jakarta.validation.constraints.NotBlank;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BrandRequest {
    @NotBlank(message = "NAME_REQUIRED")
    String name;

    String description;
    String countryOfOrigin;
    String website;
    Boolean active;
}

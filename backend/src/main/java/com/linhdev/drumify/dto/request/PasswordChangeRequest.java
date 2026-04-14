package com.linhdev.drumify.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PasswordChangeRequest {

    @NotBlank(message = "PASSWORD_IS_REQUIRED")
    String oldPassword;

    @NotBlank(message = "PASSWORD_IS_REQUIRED")
    @Size(min = 6, message = "INVALID_PASSWORD")
    String newPassword;

    @NotBlank(message = "PASSWORD_IS_REQUIRED")
    String confirmPassword;
}

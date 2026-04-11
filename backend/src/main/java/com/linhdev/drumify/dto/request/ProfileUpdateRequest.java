package com.linhdev.drumify.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileUpdateRequest {
    @Size(max = 50, message = "First name cannot exceed 50 characters")
    String firstName;

    @Size(max = 50, message = "Last name cannot exceed 50 characters")
    String lastName;

    String fullName;

    @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone number must be 10 or 11 digits")
    String phoneNumber;

    String avatarUrl;

    @Past(message = "Date of birth must be in the past")
    LocalDate dob;

    Boolean sex;
}

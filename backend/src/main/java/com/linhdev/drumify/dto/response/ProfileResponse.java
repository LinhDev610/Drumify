package com.linhdev.drumify.dto.response;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileResponse {
    String profileId;
    String userId;
    String email;
    String username;
    String firstName;
    String lastName;
    String fullName;
    String phoneNumber;
    String avatarUrl;
    Boolean accountEnabled;
    Set<AddressResponse> addresses;
    List<String> roles;
    List<String> groups;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    LocalDate dob;

    Boolean sex;
}

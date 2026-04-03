package com.linhdev.drumify.entity;

import java.time.LocalDate;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "profiles")
public class Profile {
    // ID from Keycloak, hide with user
    String userId;

    // ID from MySQL, show with user
    @Id
    String profileId;

    @Column(unique = true, nullable = false)
    String username;

    @Column(unique = true, nullable = false)
    String email;

    String firstName;
    String lastName;

    LocalDate dob;
    boolean sex;
}

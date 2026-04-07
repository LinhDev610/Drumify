package com.linhdev.drumify.entity;

import java.time.LocalDate;
import java.util.Set;

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
    @GeneratedValue(strategy = GenerationType.UUID)
    String profileId;

    @Column(unique = true, nullable = false)
    String username;

    @Column(unique = true, nullable = false)
    String email;

    String fullName;
    String firstName;
    String lastName;

    String phoneNumber;
    String address;
    String avatarUrl;

    LocalDate dob;
    Boolean sex;

    @OneToOne(mappedBy = "profile", fetch = FetchType.LAZY)
    Cart cart;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_addresses",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "address_id"))
    Set<Address> addresses;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "profile_used_vouchers",
            joinColumns = @JoinColumn(name = "profile_id"),
            inverseJoinColumns = @JoinColumn(name = "voucher_id"))
    Set<Voucher> usedVouchers;
}

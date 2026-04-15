package com.linhdev.drumify.dto.warehouse;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupplierResponse {
    String id;
    String name;
    String contactName;
    String phone;
    String email;
    String address;
    String taxCode;
    String note;
    boolean active;
    LocalDateTime createdAt;
}

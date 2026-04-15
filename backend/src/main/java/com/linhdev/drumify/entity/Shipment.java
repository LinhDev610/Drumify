package com.linhdev.drumify.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;

import com.linhdev.drumify.enums.ShipmentProvider;
import com.linhdev.drumify.enums.ShipmentStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "shipments")
public class Shipment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String shippingAddress;

    String orderCode;

    @Column(name = "client_order_code")
    String clientOrderCode;

    LocalDate shippedDate;
    LocalDate estimatedDelivery;

    Long totalFee;

    @Enumerated(EnumType.STRING)
    ShipmentProvider provider;

    @Enumerated(EnumType.STRING)
    ShipmentStatus status;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    Order order;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Column(name = "tracking_note", columnDefinition = "TEXT")
    String trackingNote;

    @Column(name = "last_sync_at")
    LocalDateTime lastSyncAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}

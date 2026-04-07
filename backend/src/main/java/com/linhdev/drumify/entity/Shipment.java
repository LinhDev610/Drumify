package com.linhdev.drumify.entity;

import java.time.LocalDate;

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

    String orderCode; // GHN order code để tracking

    LocalDate shippedDate;
    LocalDate estimatedDelivery;

    Long totalFee; // Tổng phí vận chuyển (VND)

    @Enumerated(EnumType.STRING)
    ShipmentProvider provider;

    @Enumerated(EnumType.STRING)
    ShipmentStatus status;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    Order order;
}

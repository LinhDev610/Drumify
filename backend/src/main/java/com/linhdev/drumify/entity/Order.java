package com.linhdev.drumify.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;

import com.linhdev.drumify.enums.OrderStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "order_code", unique = true)
    String code;

    String note;

    // Status
    @Enumerated(EnumType.STRING)
    OrderStatus status;

    String cancelReason;
    LocalDate expectedDeliveryDate;
    LocalDateTime orderAt;

    @OneToOne(mappedBy = "order")
    Shipment shipment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    Profile profile;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    Address address;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    List<OrderItem> orderItem;

    @OneToOne(mappedBy = "order")
    Refund refund;

    @OneToOne(mappedBy = "order")
    Payment payment;
}

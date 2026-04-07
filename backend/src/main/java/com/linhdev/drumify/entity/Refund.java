package com.linhdev.drumify.entity;

import java.util.List;

import jakarta.persistence.*;

import com.linhdev.drumify.enums.RefundReason;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "refunds")
public class Refund {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    // Refund/Return request fields
    @Enumerated(EnumType.STRING)
    RefundReason reason; // store/customer

    String descriptionReason;
    String email;
    String address;

    String bank;
    String accountNumber;
    Double returnFee; // Phí trả hàng (10% giá trị sản phẩm nếu lý do là customer, 0 nếu lý do là store)
    Double amount;
    Double totalPaid;

    String rejectReason;

    @OneToMany(mappedBy = "refund", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    List<RefundMedia> refundMedia;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    Order order;
}

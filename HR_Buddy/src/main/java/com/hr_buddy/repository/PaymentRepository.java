package com.hr_buddy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hr_buddy.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}

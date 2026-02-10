package com.hr_buddy.entity;

import java.time.LocalDate;
import java.time.YearMonth;

import com.hr_buddy.enums.PayrollStatus;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
    name = "payrolls",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"employee_id", "month"})
    }
)
@Getter
@Setter
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "employee_id")
    private Employee employee;
 
    
    
    @Column(nullable = false)
    private LocalDate createdAt;

    @Column(nullable = false)
    private Double baseSalary;

    @Column(nullable = false)
    private Integer presentDays;

    @Column(nullable = false)
    private Integer leaveDays;

    @Column(nullable = false)
    private Integer absentDays;
    
    @Column(nullable = false)
    private Double allowances;
    
    @Column(nullable = false)
    private Double deductions;


    @Column(nullable = false)
    private Double netSalary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PayrollStatus status;
    
}

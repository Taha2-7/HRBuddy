package com.hr_buddy.dto;

import java.time.LocalDate;

import com.hr_buddy.enums.PayrollStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PayrollResponse {

    private Long payrollId;
    private String employeeUsername;
    private String employeeName;

    private LocalDate createdAt;

    private Double baseSalary;
    private Integer presentDays;
    private Integer leaveDays;
    private Integer absentDays;
    

    private Double allowances;
    private Double deductions;



    private Double netSalary;
    private PayrollStatus status;
}

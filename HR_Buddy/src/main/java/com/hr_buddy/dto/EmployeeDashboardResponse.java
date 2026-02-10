package com.hr_buddy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDashboardResponse {

    private long presentDaysThisMonth;
    private long paidLeavesTakenThisMonth;
    private long absentDaysThisMonth;
    private double baseSalary;
}

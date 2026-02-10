package com.hr_buddy.dto;

import java.time.LocalDate;

import com.hr_buddy.enums.LeaveStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LeaveResponse{

    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private LeaveStatus status;

    // Minimal employee info (safe)
    private Long employeeId;
    private String employeeName;
}

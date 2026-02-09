package com.hr_buddy.dto;

import java.time.LocalDate;

import com.hr_buddy.enums.AttendanceStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AttendanceResponse {

    private Long id;
    private LocalDate date;
    private AttendanceStatus status;

    private Long employeeId;
    private String employeeName;
}

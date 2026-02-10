package com.hr_buddy.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EmployeeResponse {
    private Long id;
    private String name;
    private String username;
    private String departmentName;
    private Double baseSalary;
    private boolean active;
}

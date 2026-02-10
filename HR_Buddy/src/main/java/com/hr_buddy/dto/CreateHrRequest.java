package com.hr_buddy.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateHrRequest {

    private String username;
    private String password;
    private String name;
    private String email;
    private Long departmentId;
    private double baseSalary;
}

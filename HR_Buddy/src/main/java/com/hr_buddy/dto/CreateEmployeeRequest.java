package com.hr_buddy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateEmployeeRequest {

	@NotBlank
    private String username;
	
	@NotBlank
    private String password;
	
	@NotBlank
    private String name;
	
	@NotBlank
    private String email;
	
	@NotNull
    private Long departmentId;
	
	@NotNull
	@Positive
    private double baseSalary;
}

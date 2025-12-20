package com.hr_buddy.dto;

import java.time.YearMonth;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GeneratePayrollRequest {

    @NotNull
    private Long employeeId;

    @NotNull
    private YearMonth month;
}

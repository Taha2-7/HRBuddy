package com.hr_buddy.dto;

import com.hr_buddy.enums.LeaveStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaveDecisionRequest {

    @NotNull
    private LeaveStatus status; // true = approve, false = reject
}

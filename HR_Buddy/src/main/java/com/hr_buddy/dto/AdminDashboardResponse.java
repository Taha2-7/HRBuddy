package com.hr_buddy.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalHrCount;
    private long totalDepartments;
    private long pendingHrLeaves;
    private long hrPresentToday;

    private List<LeaveResponse> recentHrLeaves;
}

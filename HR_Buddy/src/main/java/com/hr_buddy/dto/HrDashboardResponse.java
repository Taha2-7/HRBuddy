package com.hr_buddy.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class HrDashboardResponse {

    private long totalEmployees;
    private long totalDepartments;
    private long presentToday;
    private long pendingLeaves;
    private List<LeaveResponse> recentLeaves;
}

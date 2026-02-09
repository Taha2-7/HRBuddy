package com.hr_buddy.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hr_buddy.dto.AdminDashboardResponse;
import com.hr_buddy.dto.LeaveResponse;
import com.hr_buddy.entity.Attendance;
import com.hr_buddy.entity.LeaveRequest;
import com.hr_buddy.enums.AttendanceStatus;
import com.hr_buddy.enums.LeaveStatus;
import com.hr_buddy.enums.Role;
import com.hr_buddy.repository.AttendanceRepository;
import com.hr_buddy.repository.DepartmentRepository;
import com.hr_buddy.repository.EmployeeRepository;
import com.hr_buddy.repository.LeaveRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminDashboardService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final AttendanceRepository attendanceRepository;

    public AdminDashboardResponse getDashboard() {

        long totalHrs =
                employeeRepository.countByUserRole(Role.ROLE_HR);

        long totalDepartments =
                departmentRepository.count();

        long pendingHrLeaves =
                leaveRequestRepository.countByStatusAndEmployeeUserRole(
                        LeaveStatus.PENDING,
                        Role.ROLE_HR
                );

        long hrPresentToday = countHrPresentToday();

        List<LeaveRequest> leaveRequests =
                leaveRequestRepository
                        .findTop5ByEmployeeUserRoleOrderByIdDesc(Role.ROLE_HR);
        List<LeaveResponse> recentHrLeaves = new ArrayList<>();

        for (LeaveRequest leave : leaveRequests) {

            if (leave.getEmployee() == null) {
                continue;
            }

            LeaveResponse response = mapToLeaveResponse(leave);
            recentHrLeaves.add(response);
        }
        return new AdminDashboardResponse(
                totalHrs,
                totalDepartments,
                pendingHrLeaves,
                hrPresentToday,
                recentHrLeaves
        );
    }

    // ================================
    // HELPERS
    // ================================
    private long countHrPresentToday() {

        LocalDate today = LocalDate.now();

        List<Attendance> todayAttendance =
                attendanceRepository.findByDate(today);

        return todayAttendance.stream()
                .filter(a ->
                        a.getStatus() == AttendanceStatus.PRESENT &&
                        a.getEmployee()
                        .getUser()
                        .getRole() == Role.ROLE_HR
                )
                .count();
    }

    private LeaveResponse mapToLeaveResponse(LeaveRequest leave) {

        return new LeaveResponse(
                leave.getId(),
                leave.getStartDate(),
                leave.getEndDate(),
                leave.getReason(),
                leave.getStatus(),
                leave.getEmployee().getId(),
                leave.getEmployee().getName()
        );
    }
}

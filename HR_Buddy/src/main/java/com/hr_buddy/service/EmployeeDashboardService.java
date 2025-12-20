package com.hr_buddy.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hr_buddy.dto.AttendanceResponse;
import com.hr_buddy.dto.EmployeeDashboardResponse;
import com.hr_buddy.dto.LeaveResponse;
import com.hr_buddy.entity.Employee;
import com.hr_buddy.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployeeDashboardService {

    private final AttendanceService attendanceService;
    private final LeaveService leaveService;
    private final EmployeeRepository employeeRepository;

    public EmployeeDashboardResponse getDashboard(String username) {

        YearMonth currentMonth = YearMonth.now();
        LocalDate startOfMonth = currentMonth.atDay(1);
        LocalDate endOfMonth = currentMonth.atEndOfMonth();

        // Attendance
        List<AttendanceResponse> attendanceList = attendanceService.getMyAttendance(username);

        long presentDays = attendanceList.stream()
                .filter(a -> a.getDate() != null)
                .filter(a -> !a.getDate().isBefore(startOfMonth) && !a.getDate().isAfter(endOfMonth))
                .filter(a -> "PRESENT".equalsIgnoreCase(a.getStatus().toString()))
                .count();

        long absentDays = attendanceList.stream()
                .filter(a -> a.getDate() != null)
                .filter(a -> !a.getDate().isBefore(startOfMonth) && !a.getDate().isAfter(endOfMonth))
                .filter(a -> "ABSENT".equalsIgnoreCase(a.getStatus().toString()))
                .count();

        // Leaves (Paid Leaves Taken = Approved Leaves in this month)
        List<LeaveResponse> leaveList = leaveService.getMyLeaves(username);

        long paidLeavesTaken = leaveList.stream()
                .filter(l -> l.getStartDate() != null)
                .filter(l -> !l.getStartDate().isBefore(startOfMonth) && !l.getStartDate().isAfter(endOfMonth))
                .filter(l -> "APPROVED".equalsIgnoreCase(l.getStatus().toString()))
                .count();

        // Base Salary
        Employee employee = employeeRepository.findEmployeeByUsername(username)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        double baseSalary = employee.getBaseSalary();

        return new EmployeeDashboardResponse(
                presentDays,
                paidLeavesTaken,
                absentDays,
                baseSalary
        );
    }
}

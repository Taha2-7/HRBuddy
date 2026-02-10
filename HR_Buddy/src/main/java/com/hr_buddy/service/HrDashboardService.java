package com.hr_buddy.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hr_buddy.dto.HrDashboardResponse;
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
public class HrDashboardService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public HrDashboardResponse getDashboard() {

        // 1️⃣ Total employees (excluding HRs)
        long totalEmployees =
                employeeRepository.countByUserRole(Role.ROLE_EMPLOYEE);

        // 2️⃣ Total departments
        long totalDepartments = departmentRepository.count();

        // 3️⃣ Present employees today
        long presentToday = countPresentEmployeesToday();

        // 4️⃣ Pending employee leaves
        long pendingLeaves =
                leaveRequestRepository.countByStatusAndEmployeeUserRole(
                        LeaveStatus.PENDING,
                        Role.ROLE_EMPLOYEE
                );

        // 5️⃣ Recent employee leaves (FILTER IN SERVICE)
        List<LeaveRequest> latestLeaves =
                leaveRequestRepository.findAllByOrderByIdDesc();

        List<LeaveResponse> recentLeaves = new ArrayList<>();

        for (LeaveRequest leave : latestLeaves) {

            if (leave.getEmployee() == null) {
                continue;
            }

            if (leave.getEmployee().getUser().getRole() != Role.ROLE_EMPLOYEE) {
                continue; // ❌ skip HR leaves
            }

            recentLeaves.add(
                    new LeaveResponse(
                            leave.getId(),
                            leave.getStartDate(),
                            leave.getEndDate(),
                            leave.getReason(),
                            leave.getStatus(),
                            leave.getEmployee().getId(),
                            leave.getEmployee().getName()
                    )
            );

            if (recentLeaves.size() == 5) {
                break;
            }
        }

        return new HrDashboardResponse(
                totalEmployees,
                totalDepartments,
                presentToday,
                pendingLeaves,
                recentLeaves
        );
    }

    // ================================
    // HELPERS
    // ================================
    private long countPresentEmployeesToday() {

        LocalDate today = LocalDate.now();
        List<Attendance> attendanceList =
                attendanceRepository.findByDate(today);

        long count = 0;

        for (Attendance attendance : attendanceList) {
            if (attendance.getStatus() == AttendanceStatus.PRESENT &&
                attendance.getEmployee() != null &&
                attendance.getEmployee().getUser().getRole() == Role.ROLE_EMPLOYEE) {
                count++;
            }
        }

        return count;
    }
}

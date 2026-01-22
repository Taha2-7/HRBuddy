package com.hr_buddy.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hr_buddy.dto.ApplyLeaveRequest;
import com.hr_buddy.dto.AttendanceResponse;
import com.hr_buddy.dto.ChangePasswordRequest;
import com.hr_buddy.dto.EmployeeDashboardResponse;
import com.hr_buddy.dto.LeaveResponse;
import com.hr_buddy.dto.PayrollResponse;
import com.hr_buddy.entity.LeaveRequest;
import com.hr_buddy.security.CustomUserDetails;
import com.hr_buddy.service.AttendanceService;
import com.hr_buddy.service.EmployeeDashboardService;
import com.hr_buddy.service.LeaveService;
import com.hr_buddy.service.PayrollService;
import com.hr_buddy.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final LeaveService leaveService;
    private final AttendanceService attendanceService;
    private final PayrollService payrollService;
    private final EmployeeDashboardService employeeDashboardService;
    private final UserService userService;

    
    @GetMapping("/dashboard")
    public ResponseEntity<EmployeeDashboardResponse> dashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(
                employeeDashboardService.getDashboard(userDetails.getUsername())
        );
    }
    
    @PostMapping("/leave")
    public ResponseEntity<String> applyLeave(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ApplyLeaveRequest request
    ) {
        return ResponseEntity.ok(
                leaveService.applyLeave(userDetails.getUsername(), request)
        );
    }

    @GetMapping("/leaves")
    public ResponseEntity<List<LeaveResponse>> myLeaves(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(
                leaveService.getMyLeaves(userDetails.getUsername())
        );
    }
    
    @PostMapping("/attendance")
    public String markAttendance(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return attendanceService.markAttendance(userDetails.getUsername());
    }

    @GetMapping("/attendance")
    public List<AttendanceResponse> myAttendance(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return attendanceService.getMyAttendance(userDetails.getUsername());
    }
    
 // ================================
    // EMPLOYEE: VIEW OWN PAYROLL
    // ================================
    @GetMapping("/payroll")
    public ResponseEntity<PayrollResponse> viewMyPayroll(
            @AuthenticationPrincipal CustomUserDetails user) {
    	
    	
    	PayrollResponse payroll = payrollService.getPayrollForEmployee(user.getUsername());
    	if (payroll == null) {
            return ResponseEntity.noContent().build(); // 204
        }
    	
        return ResponseEntity.ok(payroll);
    }
    
    @GetMapping("/payrolls")
    public ResponseEntity<List<PayrollResponse>> getPayrollHistory(
            @AuthenticationPrincipal CustomUserDetails user) {

        return ResponseEntity.ok(
                payrollService.getPayrollHistoryForEmployee(user.getUsername())
        );
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        return ResponseEntity.ok(
                userService.changePassword(
                        userDetails.getUsername(),
                        request.getOldPassword(),
                        request.getNewPassword()
                )
        );
    }

}


package com.hr_buddy.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.hr_buddy.dto.ApplyLeaveRequest;
import com.hr_buddy.dto.LeaveResponse;
import com.hr_buddy.entity.Attendance;
import com.hr_buddy.entity.Employee;
import com.hr_buddy.entity.LeaveRequest;
import com.hr_buddy.enums.AttendanceStatus;
import com.hr_buddy.enums.LeaveStatus;
import com.hr_buddy.enums.Role;
import com.hr_buddy.exception.EmployeeNotFoundException;
import com.hr_buddy.exception.InvalidLeaveRequestException;
import com.hr_buddy.exception.LeaveAlreadyProcessedException;
import com.hr_buddy.exception.LeaveNotFoundException;
import com.hr_buddy.repository.AttendanceRepository;
import com.hr_buddy.repository.EmployeeRepository;
import com.hr_buddy.repository.LeaveRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;

    // Employee applies for leave
    public String applyLeave(String username, ApplyLeaveRequest request) {

    	Employee employee = employeeRepository.findEmployeeByUsername(username)
    	        .orElseThrow(() -> new EmployeeNotFoundException("Employee not found"));


        // Rule: end date must be after start date
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new InvalidLeaveRequestException(
                    "End date cannot be before start date");
        }
        
        
        LeaveRequest leave = new LeaveRequest();
        leave.setEmployee(employee);
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setReason(request.getReason());
        leave.setStatus(LeaveStatus.PENDING);

        leaveRequestRepository.save(leave);

        return "Leave request submitted";
    }

    // Employee views own leaves
    public List<LeaveResponse> getMyLeaves(String username) {

    	Employee employee = employeeRepository.findEmployeeByUsername(username)
    	        .orElseThrow(() -> new EmployeeNotFoundException("Employee not found"));

        return leaveRequestRepository.findByEmployee(employee)
        		.stream()
                .map(this::mapToDto)  
                .toList();
    }

    // HR approves / rejects leave
    public String updateLeaveStatus(Long leaveId, LeaveStatus status, String hrUsername) {

        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new LeaveNotFoundException("Leave request not found"));

        // Rule: cannot modify finalized leave
        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new LeaveAlreadyProcessedException("Approved or rejected leave cannot be modified");
        }
        
        Employee hrEmployee = employeeRepository.findEmployeeByUsername(hrUsername)
    	        .orElseThrow(() -> new EmployeeNotFoundException("HR Employee not found"));

        // Rule: HR cannot approve own leave
        if (leave.getEmployee().getId().equals(hrEmployee.getId())) {
            throw new InvalidLeaveRequestException("HR cannot approve or reject their own leave");
        }
        
        leave.setStatus(status);
        leaveRequestRepository.save(leave);
        
        if (status == LeaveStatus.APPROVED) {
            markAttendanceAsLeave(leave);
        }

        return "Leave status updated to " + status;
    }
    
    // HR views all leaves
    public List<LeaveResponse> getAllLeavesForHr() {
        return leaveRequestRepository.findByEmployeeUserRole(Role.ROLE_EMPLOYEE)
        		.stream()
                .map(this::mapToDto)   // 👈 HERE
                .toList();
    }
    
    private void markAttendanceAsLeave(LeaveRequest leave) {

        Employee employee = leave.getEmployee();
        LocalDate date = leave.getStartDate();

        while (!date.isAfter(leave.getEndDate())) {

            // Avoid duplicate attendance
            if (!attendanceRepository.existsByEmployeeAndDate(employee, date)) {

                Attendance attendance = new Attendance();
                attendance.setEmployee(employee);
                attendance.setDate(date);
                attendance.setStatus(AttendanceStatus.ON_LEAVE);

                attendanceRepository.save(attendance);
            }

            date = date.plusDays(1);
        }
    }
    
    private LeaveResponse mapToDto(LeaveRequest leave) {
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
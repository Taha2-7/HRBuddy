package com.hr_buddy.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.hr_buddy.dto.AttendanceResponse;
import com.hr_buddy.entity.Attendance;
import com.hr_buddy.entity.Employee;
import com.hr_buddy.enums.AttendanceStatus;
import com.hr_buddy.exception.AttendanceAlreadyMarkedException;
import com.hr_buddy.exception.EmployeeNotFoundException;
import com.hr_buddy.repository.AttendanceRepository;
import com.hr_buddy.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    // EMPLOYEE: mark own attendance
    public String markAttendance(String username) {

    	Employee employee = employeeRepository.findEmployeeByUsername(username)
    	        .orElseThrow(() -> new EmployeeNotFoundException("Employee not found"));


        LocalDate today = LocalDate.now();

        // Prevent duplicate attendance
        if (attendanceRepository.existsByEmployeeAndDate(employee, today)) {
            throw new AttendanceAlreadyMarkedException("Attendance already marked for today");
        }

        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setDate(today);
        
        DayOfWeek day = today.getDayOfWeek();

        // ✅ Weekend Present logic
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
            attendance.setStatus(AttendanceStatus.WEEKEND_PRESENT);
        } else {
            attendance.setStatus(AttendanceStatus.PRESENT);
        }

        attendanceRepository.save(attendance);

        return "Attendance marked successfully";
    }

    // EMPLOYEE: view own attendance
    public List<AttendanceResponse> getMyAttendance(String username) {

    	Employee employee = employeeRepository.findEmployeeByUsername(username)
    	        .orElseThrow(() -> new EmployeeNotFoundException("Employee not found"));


        return attendanceRepository.findByEmployee(employee)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    // HR: view attendance by date
    public List<AttendanceResponse> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date)
                .stream()
                .map(this::mapToDto)
                .toList();
    }
    
    public List<AttendanceResponse> getAttendanceByDateAndDepartment(
            LocalDate date,
            Long departmentId
    ) {
        List<Attendance> attendanceList =
                attendanceRepository.findByDateAndEmployeeDepartmentId(
                        date,
                        departmentId
                );

        List<AttendanceResponse> response = new ArrayList<>();

        for (Attendance attendance : attendanceList) {
            response.add(
                    new AttendanceResponse(
                            attendance.getId(),
                            attendance.getDate(),
                            attendance.getStatus(),
                            attendance.getEmployee().getId(),
                            attendance.getEmployee().getName()
                    )
            );
        }

        return response;
    }

    
 // HR / EMPLOYEE: check if attendance marked today
    @Transactional(readOnly = true)
    public boolean isAttendanceMarkedToday(String username) {

        Employee employee = employeeRepository.findEmployeeByUsername(username)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found"));

        LocalDate today = LocalDate.now();

        return attendanceRepository
                .findByEmployeeAndDate(employee, today)
                .isPresent();
    }


    // DTO mapper
    private AttendanceResponse mapToDto(Attendance attendance) {
        return new AttendanceResponse(
                attendance.getId(),
                attendance.getDate(),
                attendance.getStatus(),
                attendance.getEmployee().getId(),
                attendance.getEmployee().getName()
        );
    }
}

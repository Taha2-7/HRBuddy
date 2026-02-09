package com.hr_buddy.util;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.hr_buddy.entity.Attendance;
import com.hr_buddy.entity.Employee;
import com.hr_buddy.enums.AttendanceStatus;
import com.hr_buddy.repository.AttendanceRepository;
import com.hr_buddy.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AttendanceScheduler {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;

    // Runs every day at 11:59 PM
    @Scheduled(cron = "0 59 23 * * ?")
    public void markAbsentEmployees() {

        LocalDate today = LocalDate.now();
        DayOfWeek day = today.getDayOfWeek();

        // Skip weekends
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
            return;
        }

        List<Employee> employees = employeeRepository.findAll();

        for (Employee employee : employees) {

            boolean alreadyMarked =
                    attendanceRepository.existsByEmployeeAndDate(employee, today);

            if (!alreadyMarked) {
                Attendance attendance = new Attendance();
                attendance.setEmployee(employee);
                attendance.setDate(today);
                attendance.setStatus(AttendanceStatus.ABSENT);

                attendanceRepository.save(attendance);
            }
        }
    }
}

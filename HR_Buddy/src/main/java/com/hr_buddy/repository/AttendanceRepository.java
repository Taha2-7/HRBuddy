package com.hr_buddy.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hr_buddy.entity.Attendance;
import com.hr_buddy.entity.Employee;
import com.hr_buddy.enums.AttendanceStatus;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByEmployeeAndDate(Employee employee, LocalDate date);

    boolean existsByEmployeeAndDate(Employee employee, LocalDate date);

    List<Attendance> findByEmployee(Employee employee);

    List<Attendance> findByDate(LocalDate date);
    
    long countByDateAndStatusAndEmployeeUserRole(
            LocalDate date,
            AttendanceStatus status,
            String role
    );
    
    List<Attendance> findByDateAndEmployeeDepartmentId(
            LocalDate date,
            Long departmentId
    );
    
    List<Attendance> findByEmployeeAndDateBetween(Employee employee, LocalDate start, LocalDate end);

}

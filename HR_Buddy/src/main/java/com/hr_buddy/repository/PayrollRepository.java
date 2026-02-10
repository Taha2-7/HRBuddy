package com.hr_buddy.repository;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hr_buddy.entity.Employee;
import com.hr_buddy.entity.Payroll;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {

    Optional<Payroll> findByEmployeeAndCreatedAt(Employee employee, LocalDate month);

    List<Payroll> findByEmployee(Employee employee);
    
    List<Payroll> findByCreatedAt(LocalDate month);

    Optional<Payroll> findTopByEmployeeUserUsernameOrderByCreatedAtDesc(String username);

    List<Payroll> findByEmployeeUserUsernameOrderByCreatedAtDesc(String username );
}



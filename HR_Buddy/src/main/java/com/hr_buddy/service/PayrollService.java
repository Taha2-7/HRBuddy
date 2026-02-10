package com.hr_buddy.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hr_buddy.dto.PayrollResponse;
import com.hr_buddy.entity.Attendance;
import com.hr_buddy.entity.Employee;
import com.hr_buddy.entity.Payroll;
import com.hr_buddy.enums.AttendanceStatus;
import com.hr_buddy.enums.PayrollStatus;
import com.hr_buddy.exception.EmployeeNotFoundException;
import com.hr_buddy.exception.PayrollAlreadyGeneratedException;
import com.hr_buddy.exception.PayrollNotFoundException;
import com.hr_buddy.repository.AttendanceRepository;
import com.hr_buddy.repository.EmployeeRepository;
import com.hr_buddy.repository.PayrollRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PayrollService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final PayrollRepository payrollRepository;

    // =========================================
    // GENERATE PAYROLL FOR ONE EMPLOYEE
    // =========================================
    public String generatePayrollForEmployee(String username) {

        Employee employee = employeeRepository.findEmployeeByUsername(username)
                .orElseThrow(() ->
                        new EmployeeNotFoundException("Employee not found"));

        LocalDate payrollMonth = LocalDate.now().withDayOfMonth(1);

        if (payrollRepository.findByEmployeeAndCreatedAt(employee, payrollMonth).isPresent()) {
            throw new PayrollAlreadyGeneratedException(
                    "Payroll already generated for this month");
        }

        Payroll payroll = buildPayroll(employee, payrollMonth);
        payrollRepository.save(payroll);

        return "Payroll generated for employee: " + username;
    }

    // =========================================
    // GENERATE PAYROLL FOR ALL EMPLOYEES
    // =========================================
    public String generatePayrollForAllEmployees() {

        List<Employee> employees = employeeRepository.findAll();
        LocalDate payrollMonth = LocalDate.now().withDayOfMonth(1);

        int generated = 0;
        int skipped = 0;

        for (Employee employee : employees) {

            if (payrollRepository
                    .findByEmployeeAndCreatedAt(employee, payrollMonth)
                    .isPresent()) {
                skipped++;
                continue;
            }

            Payroll payroll = buildPayroll(employee, payrollMonth);
            payrollRepository.save(payroll);
            generated++;
        }

        return "Payroll generated for "
                + generated + " employees, skipped "
                + skipped;
    }

    // =========================================
    // VIEW PAYROLL FOR ONE EMPLOYEE
    // =========================================
    public PayrollResponse getPayrollForEmployee(String username) {

        Employee employee = employeeRepository.findEmployeeByUsername(username)
                .orElseThrow(() ->
                        new EmployeeNotFoundException("Employee not found"));


        Payroll payroll = payrollRepository
                .findTopByEmployeeUserUsernameOrderByCreatedAtDesc(username)
                .orElseThrow(() ->
                        new PayrollNotFoundException("Payroll not found"));

        return mapToDto(payroll);
    }
    public List<PayrollResponse> getPayrollHistoryForEmployee(String username) {

        Employee employee = employeeRepository.findEmployeeByUsername(username)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found"));

        return payrollRepository.findByEmployeeUserUsernameOrderByCreatedAtDesc(username)
                .stream()
                .map(this::mapToDto)
                .toList();
    }


    // =========================================
    // MARK PAYROLL AS PAID
    // =========================================
    public String markPayrollAsPaid(Long payrollId) {

        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() ->
                        new PayrollNotFoundException("Payroll not found"));

        if (payroll.getStatus() == PayrollStatus.PAID) {
            throw new PayrollAlreadyGeneratedException("Payroll already paid");
        }

        payroll.setStatus(PayrollStatus.PAID);
        payrollRepository.save(payroll);

        return "Payroll marked as PAID";
    }

    // =========================================
    // INTERNAL PAYROLL BUILDER
    // =========================================
    private Payroll buildPayroll(Employee employee, LocalDate payrollMonth) {

        List<Attendance> attendanceList =
                attendanceRepository.findByEmployee(employee);

        int present = 0;
        int leave = 0;
        int absent = 0;

        for (Attendance attendance : attendanceList) {

            // only count attendance of the payroll month
            if (!attendance.getDate().getMonth().equals(payrollMonth.getMonth())) {
                continue;
            }

            if (attendance.getStatus() == AttendanceStatus.PRESENT
                    || attendance.getStatus() == AttendanceStatus.WEEKEND_PRESENT) {
                present++;
            } 
            else if (attendance.getStatus() == AttendanceStatus.ON_LEAVE) {
                leave++;
            } 
            else if (attendance.getStatus() == AttendanceStatus.ABSENT) {
                absent++;
            }
        }

        // Assume month has 30 working days (simple project logic)
        int totalDaysInMonth = 30;

        double baseSalary = employee.getBaseSalary();
        double salaryPerDay = baseSalary / totalDaysInMonth;

        // Salary is paid only for payable days
        int payableDays = present + leave;

        // Salary earned
        double earnedSalary = salaryPerDay * payableDays;

        // Allowances (example: 20% of earned salary)
        double allowances = earnedSalary * 0.20;

        // Deductions based on absent days
        double deductions = absent * salaryPerDay;

        // Final net salary
        double netSalary = earnedSalary + allowances - deductions;

        // Prevent negative salary
        if (netSalary < 0) {
            netSalary = 0;
        }

        Payroll payroll = new Payroll();
        payroll.setEmployee(employee);
        payroll.setCreatedAt(payrollMonth);

        payroll.setBaseSalary(baseSalary);
        payroll.setPresentDays(present);
        payroll.setLeaveDays(leave);
        payroll.setAbsentDays(absent);

        payroll.setAllowances(allowances);
        payroll.setDeductions(deductions);

        payroll.setNetSalary(netSalary);
        payroll.setStatus(PayrollStatus.GENERATED);

        return payroll;
    }


    // =========================================
    // ENTITY → DTO MAPPER
    // =========================================
    private PayrollResponse mapToDto(Payroll payroll) {

    	return new PayrollResponse(
    		    payroll.getId(),
    		    payroll.getEmployee().getUser().getUsername(),
    		    payroll.getEmployee().getName(),
    		    payroll.getCreatedAt(),
    		    payroll.getBaseSalary(),
    		    payroll.getPresentDays(),
    		    payroll.getLeaveDays(),
    		    payroll.getAbsentDays(),
    		    payroll.getAllowances(),
    		    payroll.getDeductions(),
    		    payroll.getNetSalary(),
    		    payroll.getStatus()
    		);

    }
}

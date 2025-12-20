package com.hr_buddy.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hr_buddy.dto.CreateHrRequest;
import com.hr_buddy.dto.DepartmentResponse;
import com.hr_buddy.entity.Department;
import com.hr_buddy.entity.Employee;
import com.hr_buddy.entity.User;
import com.hr_buddy.enums.Role;
import com.hr_buddy.repository.DepartmentRepository;
import com.hr_buddy.repository.EmployeeRepository;
import com.hr_buddy.repository.UserRepository;
import com.hr_buddy.dto.HrResponse;
import com.hr_buddy.dto.HrResponse;
import com.hr_buddy.dto.HrResponse;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentRepository departmentRepository;
    
    public AdminService(UserRepository userRepository, EmployeeRepository employeeRepository, PasswordEncoder passwordEncoder, DepartmentRepository departmentRepository) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.departmentRepository = departmentRepository;
    }

    @Transactional
    public void createHr(CreateHrRequest request) {
    	
    	if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
    	
    	Department hrDepartment = departmentRepository
                .findByName("HR")
                .orElseThrow(() ->
                        new IllegalStateException("HR department not found"));
    	
        // 1. Create User
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_HR);
        user.setEnabled(true);

        userRepository.save(user);

        // 2. Create Employee profile for HR
        Employee employee = new Employee();
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setDepartment(hrDepartment);
        employee.setBaseSalary(request.getBaseSalary());
        employee.setJoiningDate(LocalDate.now());
        employee.setUser(user);

        employeeRepository.save(employee);
    }
    
    public List<HrResponse> getAllHrs() {
        return employeeRepository.findByUserRole(Role.ROLE_HR)
                .stream()
                .map(emp -> new HrResponse(
                        emp.getId(),
                        emp.getName(),
                        emp.getUser().getUsername(),
                        emp.getDepartment().getName(),
                        emp.getUser().isEnabled()
                ))
                .toList();
    }

    @Transactional
    public void deactivateHr(Long hrId) {

        Employee employee = employeeRepository.findById(hrId)
                .orElseThrow(() -> new IllegalArgumentException("HR not found"));

        User user = employee.getUser();

        // Disable login
        user.setEnabled(false);

        // Mark employee inactive
        employee.setActive(false);

        userRepository.save(user);
        employeeRepository.save(employee);
    }

    

}

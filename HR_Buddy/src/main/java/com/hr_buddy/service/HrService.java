package com.hr_buddy.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hr_buddy.dto.CreateEmployeeRequest;
import com.hr_buddy.dto.DepartmentResponse;
import com.hr_buddy.dto.EmployeeResponse;
import com.hr_buddy.entity.Department;
import com.hr_buddy.entity.Employee;
import com.hr_buddy.entity.User;
import com.hr_buddy.enums.Role;
import com.hr_buddy.repository.DepartmentRepository;
import com.hr_buddy.repository.EmployeeRepository;
import com.hr_buddy.repository.UserRepository;

@Service
public class HrService {

    private final DepartmentRepository departmentRepository;

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public HrService(UserRepository userRepository, EmployeeRepository employeeRepository, PasswordEncoder passwordEncoder, DepartmentRepository departmentRepository) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.departmentRepository = departmentRepository;
    }

    @Transactional
    public void createEmployee(CreateEmployeeRequest request) {

    	Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
    	
    	if (userRepository.existsByUsername(request.getUsername())) {
    	    throw new IllegalArgumentException("Username already exists");
    	}

    	if (employeeRepository.existsByEmail(request.getEmail())) {
    	    throw new IllegalArgumentException("Email already exists");
    	}

    	
        // 1. Create User
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_EMPLOYEE);
        user.setEnabled(true);

        userRepository.save(user);

        // 2. Create Employee
        Employee employee = new Employee();
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setDepartment(department);
        employee.setBaseSalary(request.getBaseSalary());
        employee.setUser(user);
        employee.setActive(true);

        employeeRepository.save(employee);
    }
    
 // ================================
    // GET ALL EMPLOYEES
    // ================================
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAllEmployees() {

        List<Employee> employees =
                employeeRepository.findByUserRole(Role.ROLE_EMPLOYEE);

        List<EmployeeResponse> response = new ArrayList<>();

        for (Employee employee : employees) {

            String username = null;
            if (employee.getUser() != null) {
                username = employee.getUser().getUsername();
            }

            String departmentName = null;
            if (employee.getDepartment() != null) {
                departmentName = employee.getDepartment().getName();
            }

            response.add(
                new EmployeeResponse(
                    employee.getId(),
                    employee.getName(),
                    username,
                    departmentName,
                    employee.getBaseSalary(),
                    employee.isActive()
                )
            );
        }

        return response;
    }

    
    @Transactional
    public void deactivateEmployee(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        User user = employee.getUser();

        // Disable login
        user.setEnabled(false);

        // Mark employee inactive
        employee.setActive(false);

        userRepository.save(user);
        employeeRepository.save(employee);
    }
    
    public List<DepartmentResponse> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();

        List<DepartmentResponse> response = new ArrayList<>();
        for (Department dept : departments) {
            response.add(new DepartmentResponse(dept.getId(), dept.getName()));
        }
        return response;
    }


}

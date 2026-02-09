package com.hr_buddy.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hr_buddy.dto.DepartmentResponse;
import com.hr_buddy.entity.Department;
import com.hr_buddy.repository.DepartmentRepository;
import com.hr_buddy.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    public String createDepartment(String name) {

        if (departmentRepository.existsByName(name)) {
            return "Department already exists";
        }

        Department department = new Department();
        department.setName(name);

        departmentRepository.save(department);
        return "Department created successfully";
    }

    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll()
            .stream()
            .map(d -> new DepartmentResponse(d.getId(), d.getName()))
            .toList();
    }


    public void deleteDepartment(Long departmentId) {

        long employeeCount =
                employeeRepository.countByDepartmentId(departmentId);

        if (employeeCount > 0) {
            throw new IllegalStateException(
                "Cannot delete department. Employees are assigned to it."
            );
        }

        departmentRepository.deleteById(departmentId);
    }
}

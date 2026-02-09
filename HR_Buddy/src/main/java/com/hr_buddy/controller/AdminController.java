package com.hr_buddy.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hr_buddy.dto.AdminDashboardResponse;
import com.hr_buddy.dto.CreateHrRequest;
import com.hr_buddy.dto.DepartmentResponse;
import com.hr_buddy.dto.HrResponse;
import com.hr_buddy.entity.Department;
import com.hr_buddy.service.AdminDashboardService;
import com.hr_buddy.service.AdminService;
import com.hr_buddy.service.DepartmentService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final AdminDashboardService adminDashboardService;
    private final DepartmentService departmentService;

//    public AdminController(AdminService adminService, AdminDashboardService adminDashboardService) {
//        this.adminService = adminService;
//        this.adminDashboardService = adminDashboardService;
//    }
//    
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> dashboard() {
        return ResponseEntity.ok(
                adminDashboardService.getDashboard()
        );
    }

    @PostMapping("/hr")
    public String createHr(@RequestBody CreateHrRequest request) {
        adminService.createHr(request);
        return "HR created successfully";
    }
    
    @GetMapping("/hrs")
    public List<HrResponse> getAllHrs() {
        return adminService.getAllHrs();
    }

    @PutMapping("/hr/{id}/deactivate")
    public String deactivateHr(@PathVariable Long id) {
        adminService.deactivateHr(id);
        return "HR deactivated successfully";
    }
    
    @GetMapping("/departments")
    public List<DepartmentResponse> getDepartments() {
        return departmentService.getAllDepartments();
    }
    
    @PostMapping("/departments")
    public String createDepartment(@RequestBody Map<String, String> request) {
        departmentService.createDepartment(request.get("name"));
        return "Department created successfully";
    }
    
    @DeleteMapping("/departments/{id}")
    public String deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return "Department deleted successfully";
    }


}

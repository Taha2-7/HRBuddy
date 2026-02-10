package com.hr_buddy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hr_buddy.entity.LeaveRequest;
import com.hr_buddy.enums.LeaveStatus;
import com.hr_buddy.enums.Role;
import com.hr_buddy.entity.Employee;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    // Employee can see their own leaves
    List<LeaveRequest> findByEmployee(Employee employee);
    
 // Count pending HR leaves
    long countByStatusAndEmployeeUserRole(
            LeaveStatus status,
            Role role
    );

    // Latest 5 HR leave requests
    List<LeaveRequest> findTop5ByEmployeeUserRoleOrderByIdDesc(
            Role role
    );

    List<LeaveRequest> findAllByOrderByIdDesc();
    
    List<LeaveRequest> findByEmployeeUserRole(Role role);


    
}

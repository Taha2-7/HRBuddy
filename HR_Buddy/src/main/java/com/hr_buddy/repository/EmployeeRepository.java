package com.hr_buddy.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hr_buddy.entity.Employee;
import com.hr_buddy.enums.Role;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("""
        SELECT e
        FROM Employee e
        WHERE e.user.username = :username
    """)
    Optional<Employee> findEmployeeByUsername(@Param("username") String username);
    
    long countByUserRole(Role role);

    List<Employee> findByUserRole(Role role);

	
    long countByDepartmentId(Long departmentId);
    
    boolean existsByEmail(String email);

}

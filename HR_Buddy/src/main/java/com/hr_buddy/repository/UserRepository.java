package com.hr_buddy.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hr_buddy.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
}


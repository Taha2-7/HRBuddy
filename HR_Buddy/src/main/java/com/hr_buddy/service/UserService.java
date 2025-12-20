package com.hr_buddy.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hr_buddy.entity.User;
import com.hr_buddy.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public String changePassword(String username, String oldPassword, String newPassword) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        // Encode new password
        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);

        return "Password updated successfully";
    }
}

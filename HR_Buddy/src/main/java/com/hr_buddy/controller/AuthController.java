package com.hr_buddy.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hr_buddy.dto.LoginRequest;
import com.hr_buddy.dto.LoginResponse;
import com.hr_buddy.entity.User;
import com.hr_buddy.repository.UserRepository;
import com.hr_buddy.security.JwtTokenProvider;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
    	System.out.println("LOGIN CONTROLLER HIT");

        // 1. Authenticate username & password
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsername(),
                                request.getPassword()
                        )
                );

        // 2. Fetch user from DB
        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        // 3. Generate JWT
        String token = jwtTokenProvider.generateToken(user);

        // 4. Return token
        return new LoginResponse(token, user.getRole().name());
    }
}

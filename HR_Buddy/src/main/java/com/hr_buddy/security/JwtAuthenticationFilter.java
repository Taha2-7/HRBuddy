package com.hr_buddy.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, CustomUserDetailsService userDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

    	System.out.println("JWT FILTER HIT FOR: " + request.getRequestURI());

    	
        // 1. Get Authorization header
        String authHeader = request.getHeader("Authorization");

        // 2. Check if header contains Bearer token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            // 3. Extract token
            String token = authHeader.substring(7);

            // 4. Validate token
            if (jwtTokenProvider.validateToken(token)) {

                // 5. Extract username from token
                String username = jwtTokenProvider.getUsernameFromToken(token);

                // 6. Load user details from database
                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(username);

                // 7. Create authentication object
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                // 8. Set authentication in security context
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }
        }

        // 9. Continue filter chain
        filterChain.doFilter(request, response);
    }
}

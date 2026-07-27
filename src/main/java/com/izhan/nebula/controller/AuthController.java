package com.izhan.nebula.controller;

import com.izhan.nebula.dto.LoginRequest;
import com.izhan.nebula.dto.RegisterRequest;
import com.izhan.nebula.dto.UserResponse;
import com.izhan.nebula.model.User;
import com.izhan.nebula.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    public AuthController(
            UserService userService,
            AuthenticationManager authenticationManager,
            SecurityContextRepository securityContextRepository) {

        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(
            @Valid
            @RequestBody // converts JSON into RegisterRequest
            RegisterRequest request) {

        User user = userService.register(
                request.getEmail(),
                request.getPassword()
        );

        return UserResponse.from(user);
    }

    @PostMapping("/login")
    public UserResponse login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        Authentication authenticationRequest =
                UsernamePasswordAuthenticationToken.unauthenticated(
                        request.getEmail(),
                        request.getPassword()
                );

        Authentication authentication =
                authenticationManager.authenticate(
                        authenticationRequest
                );

        SecurityContext securityContext =
                SecurityContextHolder.createEmptyContext();

        securityContext.setAuthentication(authentication);

        SecurityContextHolder.setContext(securityContext);

        securityContextRepository.saveContext(
                securityContext,
                httpRequest,
                httpResponse
        );

        User user =
                userService.getByEmail(authentication.getName());

        return UserResponse.from(user);
    }

    @GetMapping("/me")
    public UserResponse me(Principal principal) {

        User user = userService.getByEmail(principal.getName());

        return UserResponse.from(user);
    }
}

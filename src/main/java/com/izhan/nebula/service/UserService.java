package com.izhan.nebula.service;

import com.izhan.nebula.exception.DuplicateResourceException;
import com.izhan.nebula.exception.ResourceNotFoundException;
import com.izhan.nebula.model.User;
import com.izhan.nebula.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User register(
            String email,
            String rawPassword) {

        String normalizedEmail =
                email.trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new DuplicateResourceException(
                    "An account with this email already exists."
            );
        }

        String passwordHash = passwordEncoder.encode(rawPassword);

        User user = new User(normalizedEmail, passwordHash);

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getByEmail(String email) {
        return userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        )
                );
    }
}

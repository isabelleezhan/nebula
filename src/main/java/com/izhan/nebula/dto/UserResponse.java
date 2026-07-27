package com.izhan.nebula.dto;

import com.izhan.nebula.model.User;

import java.time.LocalDateTime;

public class UserResponse {

    private final Long id;
    private final String email;
    private final LocalDateTime createdAt;

    public UserResponse(
            Long id,
            String email,
            LocalDateTime createdAt) {

        this.id = id;
        this.email = email;
        this.createdAt = createdAt;
    }

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}

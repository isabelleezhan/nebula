package com.izhan.nebula.dto;

import com.izhan.nebula.model.Subject;

import java.time.LocalDateTime;

public class SubjectResponse {

    private final Long id;
    private final String name;
    private final LocalDateTime createdAt;

    public SubjectResponse(
            Long id,
            String name,
            LocalDateTime createdAt) {

        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
    }

    public static SubjectResponse from(Subject subject) {
        return new SubjectResponse(
                subject.getId(),
                subject.getName(),
                subject.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}

package com.izhan.nebula.dto;

import com.izhan.nebula.model.Planet;
import com.izhan.nebula.model.PlanetStage;

import java.time.LocalDateTime;

public class PlanetResponse {

    private final Long id;
    private final String name;
    private final long seed;
    private final int accumulatedFocusMinutes;
    private final int requiredFocusMinutes;
    private final double progressPercentage;
    private final PlanetStage stage;
    private final Long subjectId;
    private final LocalDateTime createdAt;
    private final LocalDateTime completedAt;

    public PlanetResponse(
            Long id,
            String name,
            long seed,
            int accumulatedFocusMinutes,
            int requiredFocusMinutes,
            double progressPercentage,
            PlanetStage stage,
            Long subjectId,
            LocalDateTime createdAt,
            LocalDateTime completedAt) {

        this.id = id;
        this.name = name;
        this.seed = seed;
        this.accumulatedFocusMinutes = accumulatedFocusMinutes;
        this.requiredFocusMinutes = requiredFocusMinutes;
        this.progressPercentage = progressPercentage;
        this.stage = stage;
        this.subjectId = subjectId;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
    }

    public static PlanetResponse from(Planet planet) {
        return new PlanetResponse(
                planet.getId(),
                planet.getName(),
                planet.getSeed(),
                planet.getAccumulatedFocusMinutes(),
                planet.getRequiredFocusMinutes(),
                planet.getProgressPercentage(),
                planet.getStage(),
                planet.getSubject().getId(),
                planet.getCreatedAt(),
                planet.getCompletedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public long getSeed() {
        return seed;
    }

    public int getAccumulatedFocusMinutes() {
        return accumulatedFocusMinutes;
    }

    public int getRequiredFocusMinutes() {
        return requiredFocusMinutes;
    }

    public double getProgressPercentage() {
        return progressPercentage;
    }

    public PlanetStage getStage() {
        return stage;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
}

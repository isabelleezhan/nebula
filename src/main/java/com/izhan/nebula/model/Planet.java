package com.izhan.nebula.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "planets")
public class Planet {

    public static final int DEFAULT_REQUIRED_FOCUS_MINUTES = 600;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private long seed;

    @Min(0)
    @Column(name = "accumulated_focus_minutes", nullable = false)
    private int accumulatedFocusMinutes;

    @Min(1)
    @Column(name = "required_focus_minutes", nullable = false)
    private int requiredFocusMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlanetStage stage;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "study_context_id", nullable = false)
    private Subject subject;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    protected Planet() {
        // JPA requires a no-argument constructor.
    }

    public Planet(String name, long seed, Subject subject) {
        this.name = name;
        this.seed = seed;
        this.subject = subject;
        this.accumulatedFocusMinutes = 0;
        this.requiredFocusMinutes = DEFAULT_REQUIRED_FOCUS_MINUTES;
        this.stage = PlanetStage.BARREN;
    }

    @PrePersist
    private void beforeInsert() {
        this.createdAt = LocalDateTime.now();
    }

    public void rename(String newName) {
        if (newName == null || newName.isBlank()) {
            throw new IllegalArgumentException(
                    "Planet name cannot be blank."
            );
        }

        this.name = newName.trim();
    }

    public void addFocusMinutes(int minutes) {
        if (minutes <= 0) {
            throw new IllegalArgumentException(
                    "Focus minutes must be greater than zero."
            );
        }

        if (isComplete()) {
            throw new IllegalStateException(
                    "Cannot add focus time to a completed planet."
            );
        }

        accumulatedFocusMinutes += minutes;

        updateStage();
    }

    private void updateStage() {
        double progress =
                (double) accumulatedFocusMinutes / requiredFocusMinutes;

        if (progress >= 1.0) {
            stage = PlanetStage.COMPLETE;
            completedAt = LocalDateTime.now();
        } else if (progress >= 0.8) {
            stage = PlanetStage.CIVILIZATION;
        } else if (progress >= 0.6) {
            stage = PlanetStage.BIOSPHERE;
        } else if (progress >= 0.4) {
            stage = PlanetStage.TERRAIN;
        } else if (progress >= 0.2) {
            stage = PlanetStage.ATMOSPHERE;
        } else {
            stage = PlanetStage.BARREN;
        }
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

    public PlanetStage getStage() {
        return stage;
    }

    public Subject getSubject() {
        return subject;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public boolean isComplete() {
        return stage == PlanetStage.COMPLETE;
    }

    public double getProgressPercentage() {
        return Math.min(
                100.0,
                accumulatedFocusMinutes * 100.0 / requiredFocusMinutes
        );
    }
}

package com.izhan.nebula.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

import java.time.LocalDateTime;

@Entity
@Table(name = "focus_sessions")
public class FocusSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "ended_at", nullable = false)
    private LocalDateTime endedAt;

    @Min(1)
    @Column(nullable = false)
    private int duration;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "planet_id", nullable = false)
    private Planet planet;

    protected FocusSession() {

    }

    public FocusSession(LocalDateTime startedAt, LocalDateTime endedAt, int duration,  Planet planet) {
        this.startedAt = startedAt;
        this.endedAt = endedAt;
        this.duration = duration;
        this.planet = planet;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getEndedAt() {
        return endedAt;
    }

    public void setEndedAt(LocalDateTime endedAt) {
        this.endedAt = endedAt;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public Planet getPlanet() {
        return planet;
    }

    public void setPlanet(Planet planet) {
        this.planet = planet;
    }
}

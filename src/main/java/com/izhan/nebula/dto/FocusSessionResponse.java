package com.izhan.nebula.dto;

import com.izhan.nebula.model.FocusSession;

import java.time.LocalDateTime;

public class FocusSessionResponse {

    private final Long id;
    private final LocalDateTime startedAt;
    private final LocalDateTime endedAt;
    private final int durationMinutes;
    private final Long planetId;

    public FocusSessionResponse(
            Long id,
            LocalDateTime startedAt,
            LocalDateTime endedAt,
            int durationMinutes,
            Long planetId) {

        this.id = id;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
        this.durationMinutes = durationMinutes;
        this.planetId = planetId;
    }

    public static FocusSessionResponse from(FocusSession session) {
        return new FocusSessionResponse(
                session.getId(),
                session.getStartedAt(),
                session.getEndedAt(),
                session.getDuration(),
                session.getPlanet().getId()
        );
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public LocalDateTime getEndedAt() {
        return endedAt;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public Long getPlanetId() {
        return planetId;
    }
}

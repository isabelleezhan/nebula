package com.izhan.nebula.service;

import com.izhan.nebula.model.FocusSession;
import com.izhan.nebula.model.Planet;
import com.izhan.nebula.model.Subject;
import com.izhan.nebula.repository.FocusSessionRepository;
import com.izhan.nebula.repository.PlanetRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class FocusSessionService {

    private final FocusSessionRepository focusSessionRepository;
    private final PlanetRepository planetRepository;

    // Constructor injection
    public FocusSessionService(FocusSessionRepository focusSessionRepository,
                               PlanetRepository planetRepository) {
        this.focusSessionRepository = focusSessionRepository;
        this.planetRepository = planetRepository;
    }

    @Transactional
    public FocusSession recordCompletedSession(
            Long planetId,
            LocalDateTime startedAt,
            LocalDateTime endedAt,
            int durationMinutes) {

        validateSession(startedAt, endedAt, durationMinutes);

        Planet planet = planetRepository.findById(planetId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Planet not found: " + planetId
                        )
                );

        planet.addFocusMinutes(durationMinutes);

        FocusSession session = new FocusSession(
                startedAt,
                endedAt,
                durationMinutes,
                planet
        );

        planetRepository.save(planet);

        if (planet.isComplete()) {
            createNextPlanet(planet.getSubject());
        }

        return focusSessionRepository.save(session);
    }

    private void validateSession(
            LocalDateTime startedAt,
            LocalDateTime endedAt,
            int durationMinutes) {

        if (startedAt == null || endedAt == null) {
            throw new IllegalArgumentException(
                    "Session start and end times are required."
            );
        }

        if (!endedAt.isAfter(startedAt)) {
            throw new IllegalArgumentException(
                    "Session end time must be after its start time."
            );
        }

        if (durationMinutes <= 0) {
            throw new IllegalArgumentException(
                    "Session duration must be greater than zero."
            );
        }
    }

    private void createNextPlanet(Subject subject) {

        Planet nextPlanet = new Planet(
                "Unnamed Planet",
                ThreadLocalRandom.current().nextLong(),
                subject
        );

        planetRepository.save(nextPlanet);
    }
}

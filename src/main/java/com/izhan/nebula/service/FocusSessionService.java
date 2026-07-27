package com.izhan.nebula.service;

import com.izhan.nebula.model.FocusSession;
import com.izhan.nebula.model.Planet;
import com.izhan.nebula.model.Subject;
import com.izhan.nebula.model.User;
import com.izhan.nebula.repository.FocusSessionRepository;
import com.izhan.nebula.repository.PlanetRepository;
import com.izhan.nebula.repository.SubjectRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class FocusSessionService {

    private final FocusSessionRepository focusSessionRepository;
    private final PlanetRepository planetRepository;
    private final SubjectRepository subjectRepository;

    // Constructor injection
    public FocusSessionService(FocusSessionRepository focusSessionRepository,
                               PlanetRepository planetRepository,
                               SubjectRepository subjectRepository) {
        this.focusSessionRepository = focusSessionRepository;
        this.planetRepository = planetRepository;
        this.subjectRepository = subjectRepository;
    }

    @Transactional
    public FocusSession recordCompletedSession(
            Long planetId,
            LocalDateTime startedAt,
            LocalDateTime endedAt,
            int durationMinutes,
            User user) {

        validateSession(startedAt, endedAt, durationMinutes);

        Planet planet = planetRepository
                .findByIdAndSubjectUser(
                        planetId,
                        user
                )
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

    @Transactional(readOnly = true)
    public List<FocusSession> getSessionsForPlanet(
            Long planetId,
            User user) {

        Planet planet = planetRepository
                .findByIdAndSubjectUser(
                        planetId,
                        user
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Planet not found: " + planetId
                        )
                );

        return focusSessionRepository
                .findByPlanetOrderByStartedAtAsc(planet);
    }

    @Transactional(readOnly = true)
    public List<FocusSession> getSessionsForSubject(
            Long subjectId,
            User user) {

        Subject subject = subjectRepository
                .findByIdAndUser(
                        subjectId,
                        user
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Subject not found: " + subjectId
                        )
                );

        return focusSessionRepository
                .findByPlanetSubjectOrderByStartedAtAsc(
                        subject
                );
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

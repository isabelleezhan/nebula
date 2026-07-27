package com.izhan.nebula.repository;

import com.izhan.nebula.model.FocusSession;
import com.izhan.nebula.model.Planet;
import com.izhan.nebula.model.Subject;
import com.izhan.nebula.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface FocusSessionRepository
        extends JpaRepository<FocusSession, Long> {

    List<FocusSession> findByPlanetOrderByStartedAtAsc(
            Planet planet
    );

    List<FocusSession> findByPlanetSubjectOrderByStartedAtAsc(
            Subject subject
    );

    List<FocusSession> findByPlanetSubjectUserAndStartedAtBetweenOrderByStartedAtAsc(
            User user,
            LocalDateTime start,
            LocalDateTime end
    );
}

package com.izhan.nebula.repository;

import com.izhan.nebula.model.Planet;
import com.izhan.nebula.model.PlanetStage;
import com.izhan.nebula.model.Subject;
import com.izhan.nebula.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlanetRepository
        extends JpaRepository<Planet, Long> {

    // find all planets belonging to subject sorted by oldest 'createdAt' to newest
    List<Planet> findBySubjectOrderByCreatedAtAsc(Subject subject);

    // find first planet of user whose subject equals this subject and
    // whose stage is NOT this stage, if it exists
    Optional<Planet> findFirstBySubjectAndSubjectUserAndStageNot(
            Subject subject,
            User user,
            PlanetStage stage
    );

    Optional<Planet> findByIdAndSubjectUser(
            Long planetId,
            User user
    );
}

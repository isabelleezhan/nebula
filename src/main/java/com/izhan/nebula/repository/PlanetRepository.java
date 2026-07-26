package com.izhan.nebula.repository;

import com.izhan.nebula.model.Planet;
import com.izhan.nebula.model.PlanetStage;
import com.izhan.nebula.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlanetRepository
        extends JpaRepository<Planet, Long> {

    // find first planet whose subject equals this subject and
    // whose stage is NOT this stage, if it exists
    Optional<Planet> findFirstBySubjectAndStageNot(
            Subject subject,
            PlanetStage stage
    );
}

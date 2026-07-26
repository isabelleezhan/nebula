package com.izhan.nebula.service;

import com.izhan.nebula.model.Planet;
import com.izhan.nebula.model.PlanetStage;
import com.izhan.nebula.model.Subject;
import com.izhan.nebula.repository.PlanetRepository;
import com.izhan.nebula.repository.SubjectRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlanetService {

    private final PlanetRepository planetRepository;
    private final SubjectRepository subjectRepository;

    public PlanetService(
            PlanetRepository planetRepository,
            SubjectRepository subjectRepository) {

        this.planetRepository = planetRepository;
        this.subjectRepository = subjectRepository;
    }

    @Transactional(readOnly = true)
    public Planet getActivePlanet(Long subjectId) {

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Subject not found: " + subjectId
                        )
                );

        return planetRepository
                .findFirstBySubjectAndStageNot(
                        subject,
                        PlanetStage.COMPLETE
                )
                .orElseThrow(() ->
                        new IllegalStateException(
                                "No active planet exists for subject: "
                                        + subjectId
                        )
                );
    }
}


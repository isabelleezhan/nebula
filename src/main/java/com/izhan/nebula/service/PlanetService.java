package com.izhan.nebula.service;

import com.izhan.nebula.exception.ResourceNotFoundException;
import com.izhan.nebula.model.Planet;
import com.izhan.nebula.model.PlanetStage;
import com.izhan.nebula.model.Subject;
import com.izhan.nebula.model.User;
import com.izhan.nebula.repository.PlanetRepository;
import com.izhan.nebula.repository.SubjectRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
    public Planet getActivePlanet(Long subjectId, User user) {

        Subject subject = subjectRepository.findByIdAndUser(subjectId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Subject not found: " + subjectId
                        )
                );

        return planetRepository
                .findFirstBySubjectAndSubjectUserAndStageNot(
                        subject,
                        user,
                        PlanetStage.COMPLETE
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No active planet exists for subject: "
                                        + subjectId
                        )
                );
    }

    @Transactional(readOnly = true)
    public List<Planet> getPlanetsForSubject(Long subjectId, User user) {

        Subject subject = subjectRepository.findByIdAndUser(subjectId, user)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Subject not found: " + subjectId
                        )
                );

        return planetRepository
                .findBySubjectOrderByCreatedAtAsc(subject);
    }

    @Transactional(readOnly = true)
    public Planet getPlanet(Long planetId, User user) {
        return planetRepository
                .findByIdAndSubjectUser(
                        planetId,
                        user
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Planet not found: " + planetId
                        )
                );
    }

    @Transactional
    public Planet renamePlanet(
            Long planetId,
            String newName,
            User user) {

        Planet planet = planetRepository
                .findByIdAndSubjectUser(
                        planetId,
                        user
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Planet not found: " + planetId
                        )
                );

        planet.rename(newName);

        return planetRepository.save(planet);
    }
}


package com.izhan.nebula.service;

import com.izhan.nebula.model.Planet;
import com.izhan.nebula.model.Subject;
import com.izhan.nebula.repository.PlanetRepository;
import com.izhan.nebula.repository.SubjectRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.ThreadLocalRandom;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final PlanetRepository planetRepository;

    public SubjectService(
            SubjectRepository subjectRepository,
            PlanetRepository planetRepository) {

        this.subjectRepository = subjectRepository;
        this.planetRepository = planetRepository;
    }

    @Transactional
    public Subject createSubject(String name) {

        validateName(name);

        String trimmedName = name.trim();

        if (subjectRepository.existsByNameIgnoreCase(trimmedName)) {
            throw new IllegalArgumentException(
                    "A subject with this name already exists."
            );
        }

        Subject subject = new Subject(trimmedName);

        Subject savedSubject =
                subjectRepository.save(subject);

        Planet firstPlanet = new Planet(
                generatePlanetName(),
                generatePlanetSeed(),
                savedSubject
        );

        planetRepository.save(firstPlanet);

        return savedSubject;
    }

    private void validateName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException(
                    "Subject name cannot be blank."
            );
        }
    }

    private long generatePlanetSeed() {
        return ThreadLocalRandom.current().nextLong();
    }

    private String generatePlanetName() {
        return "Unnamed Planet";
    }
}

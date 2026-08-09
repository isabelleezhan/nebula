package com.izhan.nebula.service;

import com.izhan.nebula.exception.DuplicateResourceException;
import com.izhan.nebula.exception.ResourceNotFoundException;
import com.izhan.nebula.model.Planet;
import com.izhan.nebula.model.Subject;
import com.izhan.nebula.model.User;
import com.izhan.nebula.repository.PlanetRepository;
import com.izhan.nebula.repository.SubjectRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
    public Subject createSubject(
            String name,
            User user) {

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException(
                    "Subject name cannot be blank."
            );
        }

        if (user == null) {
            throw new IllegalArgumentException(
                    "User cannot be null."
            );
        }

        String trimmedName = name.trim();

        if (subjectRepository.existsByUserAndNameIgnoreCase(
                user,
                trimmedName)) {

            throw new DuplicateResourceException(
                    "You already have a subject with this name."
            );
        }

        Subject subject = new Subject(
                trimmedName,
                user
        );

        Subject savedSubject =
                subjectRepository.save(subject);

        Planet planet = new Planet(
                "Unnamed Planet",
                generatePlanetSeed(),
                savedSubject
        );

        planetRepository.save(planet);

        return savedSubject;
    }

    @Transactional(readOnly = true)
    public List<Subject> getAllSubjects(User user) {

        return subjectRepository
                .findByUserOrderByCreatedAtAsc(user);
    }

    @Transactional(readOnly = true)
    public Subject getSubject(
            Long subjectId,
            User user) {

        return subjectRepository
                .findByIdAndUser(subjectId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Subject not found: " + subjectId
                        )
                );
    }

    private long generatePlanetSeed() {
        return ThreadLocalRandom
                .current()
                .nextLong();
    }

    @Transactional
    public Subject renameSubject(
            Long subjectId,
            String newName,
            User user) {

        Subject subject =
                subjectRepository
                        .findByIdAndUser(
                                subjectId,
                                user
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Subject not found: "
                                                + subjectId
                                )
                        );

        subject.rename(newName);

        return subjectRepository.save(subject);
    }
}

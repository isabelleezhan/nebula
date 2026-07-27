package com.izhan.nebula.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PlanetTest {

    private User user;

    @BeforeEach
    void setUp() {
        user = new User("CPSC 213",
                "fake-password-hash");
    }

    @Test
    void newPlanetStartsBarrenWithZeroProgress() {
        Subject subject = new Subject("CPSC 213", user);

        Planet planet = new Planet(
                "Aeris IV",
                12345L,
                subject
        );

        assertEquals(0, planet.getAccumulatedFocusMinutes());
        assertEquals(PlanetStage.BARREN, planet.getStage());
        assertFalse(planet.isComplete());
        assertEquals(0.0, planet.getProgressPercentage());
    }

    @Test
    void addingFocusMinutesIncreasesProgress() {
        Subject subject = new Subject("CPSC 213", user);

        Planet planet = new Planet(
                "Aeris IV",
                12345L,
                subject
        );

        planet.addFocusMinutes(120);

        assertEquals(120, planet.getAccumulatedFocusMinutes());
        assertEquals(20.0, planet.getProgressPercentage());
        assertEquals(PlanetStage.ATMOSPHERE, planet.getStage());
    }

    @Test
    void planetChangesStageAsProgressIncreases() {
        Subject subject = new Subject("CPSC 213", user);

        Planet planet = new Planet(
                "Aeris IV",
                12345L,
                subject
        );

        planet.addFocusMinutes(240);

        assertEquals(PlanetStage.TERRAIN, planet.getStage());

        planet.addFocusMinutes(120);

        assertEquals(PlanetStage.BIOSPHERE, planet.getStage());

        planet.addFocusMinutes(120);

        assertEquals(PlanetStage.CIVILIZATION, planet.getStage());
    }

    @Test
    void planetBecomesCompleteAtRequiredFocusTime() {
        Subject subject = new Subject("CPSC 213", user);

        Planet planet = new Planet(
                "Aeris IV",
                12345L,
                subject
        );

        planet.addFocusMinutes(600);

        assertEquals(600, planet.getAccumulatedFocusMinutes());
        assertEquals(PlanetStage.COMPLETE, planet.getStage());
        assertTrue(planet.isComplete());
        assertNotNull(planet.getCompletedAt());
        assertEquals(100.0, planet.getProgressPercentage());
    }

    @Test
    void cannotAddNonPositiveFocusMinutes() {
        Subject subject = new Subject("CPSC 213", user);

        Planet planet = new Planet(
                "Aeris IV",
                12345L,
                subject
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> planet.addFocusMinutes(0)
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> planet.addFocusMinutes(-10)
        );
    }

    @Test
    void cannotAddFocusMinutesToCompletedPlanet() {
        Subject subject = new Subject("CPSC 213", user);

        Planet planet = new Planet(
                "Aeris IV",
                12345L,
                subject
        );

        planet.addFocusMinutes(600);

        assertThrows(
                IllegalStateException.class,
                () -> planet.addFocusMinutes(10)
        );
    }
}

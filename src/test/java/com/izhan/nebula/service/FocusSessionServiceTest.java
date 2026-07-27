package com.izhan.nebula.service;

import com.izhan.nebula.model.*;
import com.izhan.nebula.repository.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class FocusSessionServiceTest {

    private FocusSessionRepository focusSessionRepository;
    private PlanetRepository planetRepository;
    private FocusSessionService focusSessionService;
    private User user;

    @BeforeEach
    void setUp() {
        focusSessionRepository = mock(FocusSessionRepository.class);
        planetRepository = mock(PlanetRepository.class);

        focusSessionService = new FocusSessionService(
                focusSessionRepository,
                planetRepository
        );
        user = new User(
                "test@example.com",
                "fake-password-hash"
        );
    }

    @Test
    void recordingSessionAddsMinutesToPlanetAndSavesBoth() {
        Subject subject = new Subject("CPSC 213", user);

        Planet planet = new Planet(
                "Aeris IV",
                12345L,
                subject
        );

        when(planetRepository.findById(1L))
                .thenReturn(Optional.of(planet));

        when(focusSessionRepository.save(any(FocusSession.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        LocalDateTime start =
                LocalDateTime.of(2026, 7, 25, 15, 0);

        LocalDateTime end =
                LocalDateTime.of(2026, 7, 25, 15, 47);

        FocusSession result =
                focusSessionService.recordCompletedSession(
                        1L,
                        start,
                        end,
                        47
                );

        assertEquals(47, planet.getAccumulatedFocusMinutes());
        assertEquals(47, result.getDuration());
        assertEquals(planet, result.getPlanet());

        verify(planetRepository).save(planet);
        verify(focusSessionRepository).save(any(FocusSession.class));
    }

    @Test
    void recordingSessionFailsWhenPlanetDoesNotExist() {
        when(planetRepository.findById(99L))
                .thenReturn(Optional.empty());

        LocalDateTime start =
                LocalDateTime.of(2026, 7, 25, 15, 0);

        LocalDateTime end =
                LocalDateTime.of(2026, 7, 25, 15, 30);

        assertThrows(
                IllegalArgumentException.class,
                () -> focusSessionService.recordCompletedSession(
                        99L,
                        start,
                        end,
                        30
                )
        );

        verify(planetRepository, never()).save(any());
        verify(focusSessionRepository, never()).save(any());
    }

    @Test
    void recordingSessionFailsForInvalidDuration() {
        LocalDateTime start =
                LocalDateTime.of(2026, 7, 25, 15, 0);

        LocalDateTime end =
                LocalDateTime.of(2026, 7, 25, 15, 30);

        assertThrows(
                IllegalArgumentException.class,
                () -> focusSessionService.recordCompletedSession(
                        1L,
                        start,
                        end,
                        0
                )
        );

        verifyNoInteractions(
                planetRepository,
                focusSessionRepository
        );
    }

    @Test
    void recordingSessionFailsWhenEndIsBeforeStart() {
        LocalDateTime start =
                LocalDateTime.of(2026, 7, 25, 16, 0);

        LocalDateTime end =
                LocalDateTime.of(2026, 7, 25, 15, 30);

        assertThrows(
                IllegalArgumentException.class,
                () -> focusSessionService.recordCompletedSession(
                        1L,
                        start,
                        end,
                        30
                )
        );

        verifyNoInteractions(
                planetRepository,
                focusSessionRepository
        );
    }

    @Test
    void completingPlanetCreatesNextPlanet() {

        Subject subject = new Subject("CPSC 213", user);

        Planet planet = new Planet(
                "Aeris IV",
                12345L,
                subject
        );

        planet.addFocusMinutes(
                Planet.DEFAULT_REQUIRED_FOCUS_MINUTES - 30
        );

        when(planetRepository.findById(1L))
                .thenReturn(Optional.of(planet));

        when(focusSessionRepository.save(any(FocusSession.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        LocalDateTime start =
                LocalDateTime.of(2026, 7, 26, 15, 0);

        LocalDateTime end =
                LocalDateTime.of(2026, 7, 26, 15, 30);

        focusSessionService.recordCompletedSession(
                1L,
                start,
                end,
                30
        );

        assertTrue(planet.isComplete());

        /*
        save #1 → completed old planet
        save #2 → brand-new active planet
         */
        verify(
                planetRepository,
                times(2)
        ).save(any(Planet.class));
    }

    @Test
    void completingPlanetCreatesNextPlanetImproved() {

        Subject subject = new Subject("CPSC 213", user);

        Planet planet = new Planet(
                "Aeris IV",
                12345L,
                subject
        );

        planet.addFocusMinutes(
                Planet.DEFAULT_REQUIRED_FOCUS_MINUTES - 30
        );

        when(planetRepository.findById(1L))
                .thenReturn(Optional.of(planet));

        when(focusSessionRepository.save(any(FocusSession.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        LocalDateTime start =
                LocalDateTime.of(2026, 7, 26, 15, 0);

        LocalDateTime end =
                LocalDateTime.of(2026, 7, 26, 15, 30);

        focusSessionService.recordCompletedSession(
                1L,
                start,
                end,
                30
        );

        assertTrue(planet.isComplete());

        ArgumentCaptor<Planet> planetCaptor =
                ArgumentCaptor.forClass(Planet.class);

        verify(
                planetRepository,
                times(2)
        ).save(planetCaptor.capture());

        Planet nextPlanet =
                planetCaptor.getAllValues().get(1);

        assertEquals(
                PlanetStage.BARREN,
                nextPlanet.getStage()
        );

        assertEquals(
                0,
                nextPlanet.getAccumulatedFocusMinutes()
        );

        assertEquals(
                subject,
                nextPlanet.getSubject()
        );

        assertFalse(
                nextPlanet.isComplete()
        );
    }
}

package com.izhan.nebula.service;

import com.izhan.nebula.dto.DailyFocusSummary;
import com.izhan.nebula.dto.SubjectFocusSummary;
import com.izhan.nebula.dto.WeeklyAnalyticsResponse;
import com.izhan.nebula.model.FocusSession;
import com.izhan.nebula.model.Planet;
import com.izhan.nebula.model.Subject;
import com.izhan.nebula.model.User;
import com.izhan.nebula.repository.FocusSessionRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AnalyticsServiceTest {

    @Mock
    private FocusSessionRepository focusSessionRepository;

    private AnalyticsService analyticsService;

    private User user;
    private Subject cpsc;
    private Subject math;
    private Planet cpscPlanet;
    private Planet mathPlanet;

    @BeforeEach
    void setUp() {

        MockitoAnnotations.openMocks(this);

        analyticsService =
                new AnalyticsService(
                        focusSessionRepository
                );

        user = new User(
                "test@example.com",
                "fake-hash"
        );

        cpsc = new Subject(
                "CPSC 213",
                user
        );

        math = new Subject(
                "MATH 101",
                user
        );

        cpscPlanet = new Planet(
                "CPSC Planet",
                123L,
                cpsc
        );

        mathPlanet = new Planet(
                "Math Planet",
                456L,
                math
        );
    }

    private FocusSession createSession(
            Planet planet,
            LocalDateTime start,
            int duration) {

        return new FocusSession(
                start,
                start.plusMinutes(duration),
                duration,
                planet
        );
    }

    @Test
    void weeklyAnalyticsAreZeroWhenThereAreNoSessions() {

        when(
                focusSessionRepository
                        .findByPlanetSubjectUserAndStartedAtBetweenOrderByStartedAtAsc(
                                eq(user),
                                any(LocalDateTime.class),
                                any(LocalDateTime.class)
                        )
        ).thenReturn(List.of());

        WeeklyAnalyticsResponse response =
                analyticsService.getWeeklyAnalytics(user);

        assertEquals(
                0,
                response.getTotalFocusMinutes()
        );

        assertEquals(
                0,
                response.getPreviousWeekFocusMinutes()
        );

        assertEquals(
                0.0,
                response.getWeeklyChangePercentage()
        );

        assertEquals(
                0,
                response.getSessionCount()
        );

        assertEquals(
                0.0,
                response.getAverageSessionMinutes()
        );

        assertEquals(
                0,
                response.getLongestSessionMinutes()
        );

        assertNull(
                response.getMostProductiveDay()
        );

        assertNull(
                response.getMostStudiedSubject()
        );

        assertTrue(
                response.getSubjects().isEmpty()
        );
    }

    @Test
    void calculatesWeeklySessionStatistics() {

        LocalDateTime now =
                LocalDateTime.now();

        FocusSession first =
                createSession(
                        cpscPlanet,
                        now.minusHours(5),
                        30
                );

        FocusSession second =
                createSession(
                        cpscPlanet,
                        now.minusHours(3),
                        60
                );

        FocusSession third =
                createSession(
                        mathPlanet,
                        now.minusHours(1),
                        45
                );

        when(
                focusSessionRepository
                        .findByPlanetSubjectUserAndStartedAtBetweenOrderByStartedAtAsc(
                                eq(user),
                                any(LocalDateTime.class),
                                any(LocalDateTime.class)
                        )
        )
                .thenReturn(
                        List.of(
                                first,
                                second,
                                third
                        )
                )
                .thenReturn(List.of());

        WeeklyAnalyticsResponse response =
                analyticsService.getWeeklyAnalytics(user);

        assertEquals(
                135,
                response.getTotalFocusMinutes()
        );

        assertEquals(
                3,
                response.getSessionCount()
        );

        assertEquals(
                45.0,
                response.getAverageSessionMinutes()
        );

        assertEquals(
                60,
                response.getLongestSessionMinutes()
        );
    }

    @Test
    void groupsFocusMinutesBySubject() {

        LocalDateTime now =
                LocalDateTime.now();

        List<FocusSession> sessions =
                List.of(
                        createSession(
                                cpscPlanet,
                                now.minusHours(5),
                                30
                        ),

                        createSession(
                                cpscPlanet,
                                now.minusHours(3),
                                60
                        ),

                        createSession(
                                mathPlanet,
                                now.minusHours(1),
                                45
                        )
                );

        when(
                focusSessionRepository
                        .findByPlanetSubjectUserAndStartedAtBetweenOrderByStartedAtAsc(
                                eq(user),
                                any(LocalDateTime.class),
                                any(LocalDateTime.class)
                        )
        )
                .thenReturn(sessions)
                .thenReturn(List.of());

        WeeklyAnalyticsResponse response =
                analyticsService.getWeeklyAnalytics(user);

        assertEquals(
                2,
                response.getSubjects().size()
        );

        SubjectFocusSummary mostStudied =
                response.getMostStudiedSubject();

        assertEquals(
                "CPSC 213",
                mostStudied.getSubjectName()
        );

        assertEquals(
                90,
                mostStudied.getFocusMinutes()
        );

        assertEquals(
                90 * 100.0 / 135,
                mostStudied.getPercentage(),
                0.001
        );
    }

    @Test
    void calculatesWeeklyChangeComparedWithPreviousWeek() {

        LocalDateTime now =
                LocalDateTime.now();

        List<FocusSession> currentWeek =
                List.of(
                        createSession(
                                cpscPlanet,
                                now.minusHours(2),
                                60
                        ),

                        createSession(
                                mathPlanet,
                                now.minusHours(1),
                                60
                        )
                );

        List<FocusSession> previousWeek =
                List.of(
                        createSession(
                                cpscPlanet,
                                now.minusWeeks(1),
                                60
                        )
                );

        when(
                focusSessionRepository
                        .findByPlanetSubjectUserAndStartedAtBetweenOrderByStartedAtAsc(
                                eq(user),
                                any(LocalDateTime.class),
                                any(LocalDateTime.class)
                        )
        )
                .thenReturn(currentWeek)
                .thenReturn(previousWeek);

        WeeklyAnalyticsResponse response =
                analyticsService.getWeeklyAnalytics(user);

        assertEquals(
                120,
                response.getTotalFocusMinutes()
        );

        assertEquals(
                60,
                response.getPreviousWeekFocusMinutes()
        );

        assertEquals(
                100.0,
                response.getWeeklyChangePercentage(),
                0.001
        );
    }

    @Test
    void findsMostProductiveDay() {

        LocalDateTime now =
                LocalDateTime.now();

        LocalDateTime monday =
                now.with(
                                java.time.temporal.TemporalAdjusters
                                        .previousOrSame(
                                                java.time.DayOfWeek.MONDAY
                                        )
                        )
                        .withHour(10)
                        .withMinute(0);

        LocalDateTime tuesday =
                monday.plusDays(1);

        List<FocusSession> sessions =
                List.of(
                        createSession(
                                cpscPlanet,
                                monday,
                                30
                        ),

                        createSession(
                                mathPlanet,
                                monday.plusHours(2),
                                20
                        ),

                        createSession(
                                cpscPlanet,
                                tuesday,
                                90
                        )
                );

        when(
                focusSessionRepository
                        .findByPlanetSubjectUserAndStartedAtBetweenOrderByStartedAtAsc(
                                eq(user),
                                any(LocalDateTime.class),
                                any(LocalDateTime.class)
                        )
        )
                .thenReturn(sessions)
                .thenReturn(List.of());

        WeeklyAnalyticsResponse response =
                analyticsService.getWeeklyAnalytics(user);

        assertEquals(
                "Tuesday",
                response.getMostProductiveDay()
        );
    }

    @Test
    void dailyFocusContainsAllSevenDays() {

        when(
                focusSessionRepository
                        .findByPlanetSubjectUserAndStartedAtBetweenOrderByStartedAtAsc(
                                eq(user),
                                any(LocalDateTime.class),
                                any(LocalDateTime.class)
                        )
        )
                .thenReturn(List.of())
                .thenReturn(List.of());

        WeeklyAnalyticsResponse response =
                analyticsService.getWeeklyAnalytics(user);

        List<DailyFocusSummary> dailyFocuses =
                response.getDailyFocuses();

        assertEquals(
                7,
                dailyFocuses.size()
        );

        assertEquals(
                "Monday",
                dailyFocuses.get(0).getDay()
        );

        assertEquals(
                "Sunday",
                dailyFocuses.get(6).getDay()
        );

        for (DailyFocusSummary day : dailyFocuses) {

            assertEquals(
                    0,
                    day.getFocusMinutes()
            );

            assertEquals(
                    0,
                    day.getSessionCount()
            );
        }
    }
}

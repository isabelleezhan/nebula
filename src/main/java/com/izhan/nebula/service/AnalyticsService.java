package com.izhan.nebula.service;

import com.izhan.nebula.dto.DailyFocusSummary;
import com.izhan.nebula.dto.SubjectFocusSummary;
import com.izhan.nebula.dto.WeeklyAnalyticsResponse;
import com.izhan.nebula.model.FocusSession;
import com.izhan.nebula.model.Subject;
import com.izhan.nebula.model.User;
import com.izhan.nebula.repository.FocusSessionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final FocusSessionRepository focusSessionRepository;

    public AnalyticsService(
            FocusSessionRepository focusSessionRepository) {

        this.focusSessionRepository = focusSessionRepository;
    }

    @Transactional(readOnly = true)
    public WeeklyAnalyticsResponse getWeeklyAnalytics(User user) {

        LocalDateTime now = LocalDateTime.now();

        LocalDateTime startOfWeek =
                getStartOfWeek(now);

        LocalDateTime startOfPreviousWeek =
                startOfWeek.minusWeeks(1);

        LocalDateTime endOfPreviousWeek =
                startOfWeek.minusNanos(1);

        List<FocusSession> sessions =
                getSessionsBetween(
                        user,
                        startOfWeek,
                        now
                );

        List<FocusSession> previousWeekSessions =
                getSessionsBetween(
                        user,
                        startOfPreviousWeek,
                        endOfPreviousWeek
                );

        int totalFocusMinutes =
                getTotalFocusMinutes(sessions);

        int previousWeekFocusMinutes =
                getTotalFocusMinutes(previousWeekSessions);

        Map<Subject, Integer> minutesBySubject =
                getMinutesBySubject(sessions);

        double weeklyChangePercentage =
                calculateWeeklyChange(
                        totalFocusMinutes,
                        previousWeekFocusMinutes
                );

        double averageSessionMinutes =
                calculateAverageSessionMinutes(
                        totalFocusMinutes,
                        sessions.size()
                );

        int longestSessionMinutes =
                getLongestSessionMinutes(sessions);

        String mostProductiveDay =
                getMostProductiveDay(sessions);

        List<SubjectFocusSummary> subjectSummaries =
                createSubjectSummaries(
                        minutesBySubject,
                        totalFocusMinutes
                );

        SubjectFocusSummary mostStudiedSubject =
                getMostStudiedSubject(
                        subjectSummaries
                );

        List<DailyFocusSummary> dailyFocuses =
                createDailyFocusSummaries(sessions);

        return new WeeklyAnalyticsResponse(
                totalFocusMinutes,
                previousWeekFocusMinutes,
                weeklyChangePercentage,
                sessions.size(),
                averageSessionMinutes,
                longestSessionMinutes,
                mostProductiveDay,
                mostStudiedSubject,
                subjectSummaries,
                dailyFocuses
        );
    }


    private LocalDateTime getStartOfWeek(
            LocalDateTime now) {

        return now
                .with(
                        TemporalAdjusters.previousOrSame(
                                DayOfWeek.MONDAY
                        )
                )
                .with(LocalTime.MIN);
    }


    private List<FocusSession> getSessionsBetween(
            User user,
            LocalDateTime start,
            LocalDateTime end) {

        return focusSessionRepository
                .findByPlanetSubjectUserAndStartedAtBetweenOrderByStartedAtAsc(
                        user,
                        start,
                        end
                );
    }


    private int getTotalFocusMinutes(
            List<FocusSession> sessions) {

        int totalFocusMinutes = 0;

        for (FocusSession session : sessions) {
            totalFocusMinutes += session.getDuration();
        }

        return totalFocusMinutes;
    }


    private Map<Subject, Integer> getMinutesBySubject(
            List<FocusSession> sessions) {

        Map<Subject, Integer> minutesBySubject =
                new HashMap<>();

        for (FocusSession session : sessions) {

            Subject subject =
                    session.getPlanet().getSubject();

            if (minutesBySubject.containsKey(subject)) {

                int currentMinutes =
                        minutesBySubject.get(subject);

                minutesBySubject.put(
                        subject,
                        currentMinutes
                                + session.getDuration()
                );

            } else {

                minutesBySubject.put(
                        subject,
                        session.getDuration()
                );
            }
        }

        return minutesBySubject;
    }


    private double calculateWeeklyChange(
            int currentWeekMinutes,
            int previousWeekMinutes) {

        if (previousWeekMinutes == 0) {

            if (currentWeekMinutes > 0) {
                return 100.0;
            }

            return 0.0;
        }

        return (currentWeekMinutes - previousWeekMinutes)
                * 100.0
                / previousWeekMinutes;
    }


    private double calculateAverageSessionMinutes(
            int totalFocusMinutes,
            int sessionCount) {

        if (sessionCount == 0) {
            return 0.0;
        }

        return (double) totalFocusMinutes
                / sessionCount;
    }


    private int getLongestSessionMinutes(
            List<FocusSession> sessions) {

        int longestSessionMinutes = 0;

        for (FocusSession session : sessions) {

            if (session.getDuration()
                    > longestSessionMinutes) {

                longestSessionMinutes =
                        session.getDuration();
            }
        }

        return longestSessionMinutes;
    }


    private String getMostProductiveDay(
            List<FocusSession> sessions) {

        Map<DayOfWeek, Integer> minutesByDay =
                getMinutesByDay(sessions);

        DayOfWeek mostProductiveDay = null;
        int mostProductiveMinutes = 0;

        for (Map.Entry<DayOfWeek, Integer> entry
                : minutesByDay.entrySet()) {

            if (entry.getValue()
                    > mostProductiveMinutes) {

                mostProductiveMinutes =
                        entry.getValue();

                mostProductiveDay =
                        entry.getKey();
            }
        }

        if (mostProductiveDay == null) {
            return null;
        }

        return formatDay(mostProductiveDay);
    }


    private Map<DayOfWeek, Integer> getMinutesByDay(
            List<FocusSession> sessions) {

        Map<DayOfWeek, Integer> minutesByDay =
                new HashMap<>();

        for (FocusSession session : sessions) {

            DayOfWeek day =
                    session.getStartedAt()
                            .getDayOfWeek();

            if (minutesByDay.containsKey(day)) {

                int currentMinutes =
                        minutesByDay.get(day);

                minutesByDay.put(
                        day,
                        currentMinutes
                                + session.getDuration()
                );

            } else {

                minutesByDay.put(
                        day,
                        session.getDuration()
                );
            }
        }

        return minutesByDay;
    }


    private String formatDay(
            DayOfWeek day) {

        String name =
                day.name().toLowerCase();

        return name.substring(0, 1)
                .toUpperCase()
                + name.substring(1);
    }


    private List<SubjectFocusSummary> createSubjectSummaries(
            Map<Subject, Integer> minutesBySubject,
            int totalFocusMinutes) {

        List<SubjectFocusSummary> subjectSummaries =
                new ArrayList<>();

        for (Map.Entry<Subject, Integer> entry
                : minutesBySubject.entrySet()) {

            Subject subject =
                    entry.getKey();

            int minutes =
                    entry.getValue();

            double percentage = 0.0;

            if (totalFocusMinutes != 0) {
                percentage =
                        minutes * 100.0
                                / totalFocusMinutes;
            }

            SubjectFocusSummary summary =
                    new SubjectFocusSummary(
                            subject.getId(),
                            subject.getName(),
                            minutes,
                            percentage
                    );

            subjectSummaries.add(summary);
        }

        subjectSummaries.sort(
                Comparator.comparingInt(
                        SubjectFocusSummary::getFocusMinutes
                ).reversed()
        );

        return subjectSummaries;
    }


    private SubjectFocusSummary getMostStudiedSubject(
            List<SubjectFocusSummary> subjectSummaries) {

        if (subjectSummaries.isEmpty()) {
            return null;
        }

        return subjectSummaries.get(0);
    }

    private List<DailyFocusSummary> createDailyFocusSummaries(
            List<FocusSession> sessions) {

        Map<DayOfWeek, Integer> minutesByDay =
                new HashMap<>();

        Map<DayOfWeek, Integer> sessionsByDay =
                new HashMap<>();

        for (FocusSession session : sessions) {

            DayOfWeek day =
                    session.getStartedAt().getDayOfWeek();

            if (minutesByDay.containsKey(day)) {

                minutesByDay.put(
                        day,
                        minutesByDay.get(day)
                                + session.getDuration()
                );

            } else {

                minutesByDay.put(
                        day,
                        session.getDuration()
                );
            }

            if (sessionsByDay.containsKey(day)) {

                sessionsByDay.put(
                        day,
                        sessionsByDay.get(day) + 1
                );

            } else {

                sessionsByDay.put(
                        day,
                        1
                );
            }
        }

        List<DailyFocusSummary> dailyFocus =
                new ArrayList<>();

        for (DayOfWeek day : DayOfWeek.values()) {

            int focusMinutes = 0;
            int sessionCount = 0;

            if (minutesByDay.containsKey(day)) {
                focusMinutes = minutesByDay.get(day);
            }

            if (sessionsByDay.containsKey(day)) {
                sessionCount = sessionsByDay.get(day);
            }

            dailyFocus.add(
                    new DailyFocusSummary(
                            formatDay(day),
                            focusMinutes,
                            sessionCount
                    )
            );
        }

        return dailyFocus;
    }
}
package com.izhan.nebula.dto;

import java.util.List;

public class WeeklyAnalyticsResponse {

    private final int totalFocusMinutes;
    private final int previousWeekFocusMinutes;
    private final double weeklyChangePercentage;

    private final int sessionCount;
    private final double averageSessionMinutes;
    private final int longestSessionMinutes;

    private final String mostProductiveDay;

    private final SubjectFocusSummary mostStudiedSubject;
    private final List<SubjectFocusSummary> subjects;
    private final List<DailyFocusSummary> dailyFocuses;

    public WeeklyAnalyticsResponse(
            int totalFocusMinutes,
            int previousWeekFocusMinutes,
            double weeklyChangePercentage,
            int sessionCount,
            double averageSessionMinutes,
            int longestSessionMinutes,
            String mostProductiveDay,
            SubjectFocusSummary mostStudiedSubject,
            List<SubjectFocusSummary> subjects,
            List<DailyFocusSummary> dailyFocuses) {

        this.totalFocusMinutes = totalFocusMinutes;
        this.previousWeekFocusMinutes =
                previousWeekFocusMinutes;
        this.weeklyChangePercentage =
                weeklyChangePercentage;
        this.sessionCount = sessionCount;
        this.averageSessionMinutes =
                averageSessionMinutes;
        this.longestSessionMinutes =
                longestSessionMinutes;
        this.mostProductiveDay =
                mostProductiveDay;
        this.mostStudiedSubject =
                mostStudiedSubject;
        this.subjects = subjects;
        this.dailyFocuses = dailyFocuses;
    }

    public int getTotalFocusMinutes() {
        return totalFocusMinutes;
    }

    public int getPreviousWeekFocusMinutes() {
        return previousWeekFocusMinutes;
    }

    public double getWeeklyChangePercentage() {
        return weeklyChangePercentage;
    }

    public int getSessionCount() {
        return sessionCount;
    }

    public double getAverageSessionMinutes() {
        return averageSessionMinutes;
    }

    public int getLongestSessionMinutes() {
        return longestSessionMinutes;
    }

    public String getMostProductiveDay() {
        return mostProductiveDay;
    }

    public SubjectFocusSummary getMostStudiedSubject() {
        return mostStudiedSubject;
    }

    public List<SubjectFocusSummary> getSubjects() {
        return subjects;
    }

    public List<DailyFocusSummary> getDailyFocuses() {
        return dailyFocuses;
    }
}



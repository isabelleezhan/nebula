package com.izhan.nebula.dto;

public class DailyFocusSummary {

    private final String day;
    private final int focusMinutes;
    private final int sessionCount;

    public DailyFocusSummary(
            String day,
            int focusMinutes,
            int sessionCount) {

        this.day = day;
        this.focusMinutes = focusMinutes;
        this.sessionCount = sessionCount;
    }

    public String getDay() {
        return day;
    }

    public int getFocusMinutes() {
        return focusMinutes;
    }

    public int getSessionCount() {
        return sessionCount;
    }
}

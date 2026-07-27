package com.izhan.nebula.dto;

public class SubjectFocusSummary {

    private final Long subjectId;
    private final String subjectName;
    private final int focusMinutes;
    private final double percentage;

    public SubjectFocusSummary(Long subjectId, String subjectName, int focusMinutes, double percentage) {
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.focusMinutes = focusMinutes;
        this.percentage = percentage;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public int getFocusMinutes() {
        return focusMinutes;
    }

    public double getPercentage() {
        return percentage;
    }
}

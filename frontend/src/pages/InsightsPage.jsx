import {useEffect, useState} from 'react'

import AppNav from '../components/AppNav'

import {getWeeklyAnalytics} from '../api/analyticsApi'

import '../styles/InsightsPage.css'


function InsightsPage() {
    const [analytics, setAnalytics] =
        useState(null)

    const [isLoading, setIsLoading] =
        useState(true)

    const [error, setError] =
        useState('')


    useEffect(() => {
        async function loadAnalytics() {
            try {
                setError('')

                const data =
                    await getWeeklyAnalytics()

                setAnalytics(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setIsLoading(false)
            }
        }

        void loadAnalytics()
    }, [])


    if (isLoading) {
        return (
            <div className="insights-page">
                <AppNav/>

                <main className="insights-main">
                    <p>
                        Reading your flight logs...
                    </p>
                </main>
            </div>
        )
    }


    if (error) {
        return (
            <div className="insights-page">
                <AppNav/>

                <main className="insights-main">
                    <p className="insights-error">
                        {error}
                    </p>
                </main>
            </div>
        )
    }


    return (
        <div className="insights-page">
            <AppNav/>

            <main className="insights-main">
                <header className="insights-header">
                    <p className="insights-eyebrow">
                        FLIGHT DATA
                    </p>

                    <h1>
                        Weekly insights
                    </h1>

                    <p className="insights-description">
                        A look at where your focus
                        traveled this week.
                    </p>
                </header>


                <section className="insights-overview">
                    <article className="insight-card">
                        <p className="insight-label">
                            TOTAL FOCUS
                        </p>

                        <p className="insight-value">
                            {analytics.totalFocusMinutes}
                        </p>

                        <p className="insight-unit">
                            minutes
                        </p>

                        {analytics.previousWeekFocusMinutes === 0 ? (
                            <p className="weekly-change neutral">
                                First active week
                            </p>
                        ) : (
                            <p
                                className={
                                    analytics.weeklyChangePercentage > 0
                                        ? 'weekly-change positive'
                                        : analytics.weeklyChangePercentage < 0
                                            ? 'weekly-change negative'
                                            : 'weekly-change neutral'
                                }
                            >
                                {analytics.weeklyChangePercentage > 0 && '+'}

                                {Math.round(
                                    analytics.weeklyChangePercentage
                                )}

                                % from last week
                            </p>
                        )}
                    </article>


                    <article className="insight-card">
                        <p className="insight-label">
                            SESSIONS
                        </p>

                        <p className="insight-value">
                            {
                                analytics
                                    .sessionCount
                            }
                        </p>

                        <p className="insight-unit">
                            this week
                        </p>
                    </article>


                    <article className="insight-card">
                        <p className="insight-label">
                            AVERAGE SESSION
                        </p>

                        <p className="insight-value">
                            {Math.round(
                                analytics
                                    .averageSessionMinutes
                            )}
                        </p>

                        <p className="insight-unit">
                            minutes
                        </p>
                    </article>


                    <article className="insight-card">
                        <p className="insight-label">
                            LONGEST SESSION
                        </p>

                        <p className="insight-value">
                            {
                                analytics
                                    .longestSessionMinutes
                            }
                        </p>

                        <p className="insight-unit">
                            minutes
                        </p>
                    </article>
                </section>

                <section className="insights-highlight-grid">
                    <article className="insight-highlight">
                        <p className="insight-label">
                            MOST PRODUCTIVE DAY
                        </p>

                        <h2>
                            {analytics.mostProductiveDay || 'No data yet'}
                        </h2>

                        <p>
                            Your strongest focus day this week.
                        </p>
                    </article>

                    <article className="insight-highlight">
                        <p className="insight-label">
                            MOST STUDIED STAR
                        </p>

                        <h2>
                            {analytics.mostStudiedSubject
                                ? analytics.mostStudiedSubject.subjectName
                                : 'No data yet'}
                        </h2>

                        <p>
                            {analytics.mostStudiedSubject
                                ? `${analytics.mostStudiedSubject.focusMinutes} minutes`
                                : 'No focus recorded yet.'}
                        </p>
                    </article>
                </section>

                <section className="insights-section">
                    <div className="insights-section-heading">
                        <p className="insight-label">
                            WEEKLY RHYTHM
                        </p>

                        <h2>
                            Focus by day
                        </h2>
                    </div>

                    <div className="weekly-chart">
                        {analytics.dailyFocuses.map((day) => {
                            const maxMinutes = Math.max(
                                ...analytics.dailyFocuses.map(
                                    currentDay => currentDay.focusMinutes
                                ),
                                1
                            )

                            const barHeight =
                                (day.focusMinutes / maxMinutes) * 100

                            return (
                                <div
                                    key={day.day}
                                    className="weekly-chart-column"
                                >
                                    <div className="weekly-chart-value">
                                        {day.focusMinutes > 0
                                            ? `${day.focusMinutes}m`
                                            : ''}
                                    </div>

                                    <div className="weekly-chart-track">
                                        <div
                                            className="weekly-chart-bar"
                                            style={{
                                                height: `${barHeight}%`
                                            }}
                                        />
                                    </div>

                                    <p className="weekly-chart-day">
                                        {day.day.slice(0, 3)}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </section>


                <section className="insights-section">
                    <div className="insights-section-heading">
                        <p className="insight-label">
                            STAR SYSTEMS
                        </p>

                        <h2>
                            Focus by subject
                        </h2>
                    </div>

                    {
                        analytics.subjects.length === 0
                            ? (
                                <p className="insights-empty">
                                    No focus sessions
                                    recorded this week.
                                </p>
                            )
                            : (
                                <div className="subject-focus-list">
                                    {
                                        analytics.subjects.map(
                                            (subject) => (
                                                <div
                                                    key={subject.subjectId}
                                                    className="subject-focus-row"
                                                >
                                                    <div className="subject-focus-info">
                                                        <div className="subject-focus-header">
                                                            <div>
                                                                <p className="subject-focus-name">
                                                                    {subject.subjectName}
                                                                </p>

                                                                <p className="subject-focus-minutes">
                                                                    {subject.focusMinutes} minutes
                                                                </p>
                                                            </div>

                                                            <p className="subject-focus-percentage">
                                                                {Math.round(
                                                                    subject.percentage
                                                                )}
                                                                %
                                                            </p>
                                                        </div>

                                                        <div className="subject-focus-track">
                                                            <div
                                                                className="subject-focus-fill"
                                                                style={{
                                                                    width: `${Math.min(
                                                                        subject.percentage,
                                                                        100
                                                                    )}%`
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    }
                                </div>
                            )
                    }
                </section>
            </main>
        </div>
    )
}


export default InsightsPage
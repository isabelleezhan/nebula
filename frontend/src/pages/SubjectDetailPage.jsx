import {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router'
import {getSubject} from '../api/subjectApi'
import {getPlanetsForSubject} from '../api/planetApi.js'
import {getSessionsForSubject} from '../api/focusSessionApi.js'
import '../styles/SubjectDetailPage.css'
import AppNav from '../components/AppNav'
import PixelPlanet from "../components/PixelPlanet.jsx";

function SubjectDetailPage() {
    const {subjectId} = useParams()
    const [subject, setSubject] = useState(null)
    const [error, setError] = useState('')
    const [planets, setPlanets] = useState([])
    const [sessions, setSessions] = useState([])

    useEffect(() => {
        async function loadSubjectDetails() {
            try {
                setError('')

                const [loadedSubject,
                    loadedPlanets,
                    loadedSessions] =
                    await Promise.all([
                        getSubject(subjectId),
                        getPlanetsForSubject(subjectId),
                        getSessionsForSubject(subjectId)])

                setSubject(loadedSubject)
                setPlanets(loadedPlanets)
                setSessions(loadedSessions)
            } catch (error) {
                setError(error.message)
            }
        }

        void loadSubjectDetails()
    }, [subjectId])

    function formatFocusTime(totalMinutes) {
        const hours =
            Math.floor(totalMinutes / 60)

        const minutes =
            totalMinutes % 60

        if (hours === 0) {
            return `${minutes} min`
        }

        if (minutes === 0) {
            return `${hours}h`
        }

        return `${hours}h ${minutes}m`
    }

    const totalFocusMinutes =
        planets.reduce(
            (total, planet) =>
                total +
                planet.accumulatedFocusMinutes,
            0
        )
    const completedWorlds =
        planets.filter(
            planet =>
                planet.stage === 'COMPLETE'
        ).length
    const currentPlanet =
        planets.find(
            planet =>
                planet.stage !== 'COMPLETE'
        )
    const completedPlanets =
        planets.filter(
            planet =>
                planet.stage === 'COMPLETE'
        )

    if (error) {
        return (
            <main>
                <p>{error}</p>
            </main>
        )
    }

    if (!subject) {
        return (
            <main>
                <p>
                    Loading star system...
                </p>
            </main>
        )
    }

    return (
        <div className="subject-detail-page">
            <AppNav/>
            <main className="subject-detail-main">
                <Link
                    to="/galaxy"
                    className="subject-detail-back"
                >
                    ← Back to galaxy
                </Link>

                <h1>
                    {subject.name}
                </h1>

                <div className="subject-detail-stats">
                    <div className="subject-detail-stat">
                    <span className="subject-detail-stat-value">
                        {formatFocusTime(totalFocusMinutes)}
                    </span>

                        <span className="subject-detail-stat-label">
                        focus minutes
                    </span>
                    </div>

                    <div className="subject-detail-stat">
                    <span className="subject-detail-stat-value">
                        {completedWorlds}
                    </span>

                        <span className="subject-detail-stat-label">
                        stabilized worlds
                     </span>
                    </div>
                </div>

                <section className="subject-worlds">
                    <p className="subject-detail-label">
                        WORLD HISTORY
                    </p>

                    {completedPlanets.length === 0 ? (
                        <p className="subject-worlds-empty">
                            No stabilized worlds yet.
                        </p>
                    ) : (
                        <div className="subject-world-strip">
                            {completedPlanets.map((planet, index) => {

                                return (
                                    <Link
                                        key={planet.id}
                                        to={`/planets/${planet.id}`}
                                        className="subject-world-item complete"
                                    >
                                        <div className="subject-world-node">
                                            <PixelPlanet planet={planet}/>
                                        </div>

                                        <p className="subject-world-name">
                                            {planet.name}
                                        </p>

                                        <p className="subject-world-stage">
                                            STABILIZED
                                        </p>

                                        {index < completedPlanets.length - 1 && (
                                            <div
                                                className="subject-world-line"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    {currentPlanet && (
                        <section className="subject-current-world">
                            <p className="subject-detail-label">
                                CURRENT WORLD
                            </p>

                            <div className="subject-current-world-content">
                                <div className="subject-current-world-planet">
                                    <PixelPlanet planet={currentPlanet}/>
                                </div>

                                <div>
                                    <h2>
                                        {currentPlanet.name}
                                    </h2>

                                    <p>
                                        {currentPlanet.stage}
                                    </p>

                                    <p>
                                        {Math.round(
                                            currentPlanet
                                                .progressPercentage
                                        )}
                                        % evolved
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="subject-missions">
                        <p className="subject-detail-label">
                            RECENT MISSIONS
                        </p>

                        {sessions.length === 0 ? (
                            <p className="subject-missions-empty">
                                No missions recorded yet.
                            </p>
                        ) : (
                            <div className="subject-mission-list">
                                {sessions
                                    .slice(0, 5)
                                    .map((session) => (
                                        <div
                                            key={session.id}
                                            className="subject-mission-row"
                                        >
                        <span>
                            {new Date(
                                session.startedAt
                            ).toLocaleDateString()}
                        </span>

                                            <span>
                            {session.durationMinutes}
                                                {' min'}
                        </span>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </section>
                </section>
            </main>
        </div>
    )
}

export default SubjectDetailPage
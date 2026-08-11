import {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router'
import AppNav from '../components/AppNav'
import {getSessionsForPlanet} from '../api/focusSessionApi'
import {getPlanet, renamePlanet} from '../api/planetApi'
import PixelPlanet from '../components/PixelPlanet'
import '../styles/PlanetDetailPage.css'


function PlanetDetailPage() {
    const {planetId} = useParams()

    const [planet, setPlanet] =
        useState(null)

    const [sessions, setSessions] =
        useState([])

    const [isLoading, setIsLoading] =
        useState(true)

    const [error, setError] =
        useState('')

    const [isRenaming, setIsRenaming] =
        useState(false)

    const [planetName, setPlanetName] =
        useState('')

    useEffect(() => {
        async function loadPlanetDetails() {
            try {
                setError('')

                const [
                    loadedPlanet,
                    loadedSessions
                ] = await Promise.all([
                    getPlanet(planetId),
                    getSessionsForPlanet(
                        planetId
                    )
                ])

                setPlanet(loadedPlanet)
                setPlanetName(loadedPlanet.name)
                setSessions(loadedSessions)
            } catch (error) {
                setError(error.message)
            } finally {
                setIsLoading(false)
            }
        }

        void loadPlanetDetails()
    }, [planetId])


    function formatSessionDate(dateTime) {
        return new Date(
            dateTime
        ).toLocaleDateString(
            undefined,
            {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }
        )
    }

    async function handleRenamePlanet(event) {
        event.preventDefault()

        const trimmedName =
            planetName.trim()

        if (!trimmedName) {
            setError(
                'Planet name cannot be blank.'
            )
            return
        }

        try {
            setError('')

            const updatedPlanet =
                await renamePlanet(
                    planet.id,
                    trimmedName
                )

            setPlanet(updatedPlanet)
            setPlanetName(updatedPlanet.name)
            setIsRenaming(false)
        } catch (error) {
            setError(error.message)
        }
    }

    function formatSessionTime(dateTime) {
        return new Date(
            dateTime
        ).toLocaleTimeString(
            undefined,
            {
                hour: 'numeric',
                minute: '2-digit'
            }
        )
    }


    if (isLoading) {
        return (
            <p>
                Retrieving world data...
            </p>
        )
    }


    return (
        <div className="planet-detail-page">
            <AppNav/>

            <main className="planet-detail-main">
                {error ? (
                    <p className="planet-detail-error">
                        {error}
                    </p>
                ) : (
                    <>
                        <Link
                            to="/galaxy"
                            className={
                                'planet-detail-back'
                            }
                        >
                            ← Return to galaxy
                        </Link>

                        <section
                            className={
                                'planet-detail-hero'
                            }
                        >
                            <div
                                className={
                                    'planet-detail-visual'
                                }
                            >
                                <PixelPlanet planet={planet}/>
                            </div>

                            <div
                                className={
                                    'planet-detail-info'
                                }
                            >
                                <p
                                    className={
                                        'planet-detail-label'
                                    }
                                >
                                    WORLD RECORD
                                </p>

                                {isRenaming ? (
                                    <form
                                        className="planet-name-form"
                                        onSubmit={handleRenamePlanet}
                                    >
                                        <input
                                            type="text"
                                            value={planetName}
                                            onChange={(event) => {
                                                setPlanetName(
                                                    event.target.value
                                                )
                                            }}
                                            autoFocus
                                            onBlur={() => {
                                                setPlanetName(
                                                    planet.name
                                                )

                                                setIsRenaming(false)
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Escape') {
                                                    setPlanetName(
                                                        planet.name
                                                    )

                                                    setIsRenaming(false)
                                                }
                                            }}
                                        />
                                    </form>
                                ) : (
                                    <button
                                        type="button"
                                        className="planet-name-button"
                                        onClick={() => {
                                            setIsRenaming(true)
                                        }}
                                        title="Rename planet"
                                    >
                                        {planet?.name}
                                    </button>
                                )}

                                <p
                                    className={
                                        'planet-detail-stage'
                                    }
                                >
                                    {planet?.stage}
                                </p>

                                <div
                                    className={
                                        'planet-detail-progress'
                                    }
                                >
                                    <div
                                        className={
                                            'planet-detail-progress-header'
                                        }
                                    >
                                        <span>
                                            {
                                                planet
                                                    ?.accumulatedFocusMinutes
                                            }
                                            {' minutes'}
                                        </span>

                                        <span>
                                            {Math.round(
                                                planet
                                                    ?.progressPercentage ??
                                                0
                                            )}
                                            %
                                        </span>
                                    </div>

                                    <div
                                        className={
                                            'planet-detail-progress-track'
                                        }
                                    >
                                        <div
                                            className={
                                                'planet-detail-progress-fill'
                                            }
                                            style={{
                                                width: `${
                                                    Math.min(
                                                        planet
                                                            ?.progressPercentage ??
                                                        0,
                                                        100
                                                    )
                                                }%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>


                        <section
                            className={
                                'mission-log'
                            }
                        >
                            <div
                                className={
                                    'mission-log-header'
                                }
                            >
                                <div>
                                    <p
                                        className={
                                            'mission-log-label'
                                        }
                                    >
                                        MISSION LOG
                                    </p>

                                    <h2>
                                        Focus sessions
                                    </h2>
                                </div>

                                <p>
                                    {sessions.length}{' '}
                                    {sessions.length === 1
                                        ? 'session'
                                        : 'sessions'}
                                </p>
                            </div>

                            {sessions.length === 0 ? (
                                <p
                                    className={
                                        'empty-mission-log'
                                    }
                                >
                                    This world has no
                                    recorded missions yet.
                                </p>
                            ) : (
                                <div
                                    className={
                                        'mission-list'
                                    }
                                >
                                    {sessions.map(
                                        (session) => (
                                            <article
                                                key={
                                                    session.id
                                                }
                                                className={
                                                    'mission-entry'
                                                }
                                            >
                                                <div>
                                                    <p
                                                        className={
                                                            'mission-date'
                                                        }
                                                    >
                                                        {formatSessionDate(
                                                            session.startedAt
                                                        )}
                                                    </p>

                                                    <p
                                                        className={
                                                            'mission-time'
                                                        }
                                                    >
                                                        {formatSessionTime(
                                                            session.startedAt
                                                        )}
                                                        {' – '}
                                                        {formatSessionTime(
                                                            session.endedAt
                                                        )}
                                                    </p>
                                                </div>

                                                <p
                                                    className={
                                                        'mission-duration'
                                                    }
                                                >
                                                    {
                                                        session.durationMinutes
                                                    }
                                                    {' min'}
                                                </p>
                                            </article>
                                        )
                                    )}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    )
}

export default PlanetDetailPage
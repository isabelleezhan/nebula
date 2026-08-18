import {useEffect, useState} from 'react'
import {renameSubject} from "../api/subjectApi.js";
import PixelPlanet from '../components/PixelPlanet'
import StageChip from '../components/StageChip'
import XpMeter from '../components/XpMeter'
import {Link} from 'react-router'
import {getPlanetGlowColor} from "../pixel-planets/src/planetVisuals.js";

function PlanetCard({planet}) {
    const glowColor = getPlanetGlowColor(planet)
    return (
        <div className="carousel-card-content">
            <div
                className="carousel-planet-glow"
                style={{
                    '--planet-glow': glowColor
                }}
            />
            <PixelPlanet planet={planet}/>
        </div>
    )
}

function StarSystemCarousel({
                                subject,
                                planets
                            }) {
    const [activeIndex, setActiveIndex] =
        useState(0)

    const [isRenamingSubject, setIsRenamingSubject] =
        useState(false)
    const [subjectName, setSubjectName] =
        useState(subject.name)

    useEffect(() => {
        setSubjectName(subject.name)
    }, [subject.name])

    useEffect(() => {
        if (planets.length === 0) {
            setActiveIndex(0)
            return
        }

        const currentPlanetIndex =
            planets.findIndex(
                (planet) =>
                    planet.stage !== 'COMPLETE'
            )

        if (currentPlanetIndex >= 0) {
            setActiveIndex(
                currentPlanetIndex
            )
        } else {
            setActiveIndex(
                planets.length - 1
            )
        }
    }, [planets])

    async function handleRenameSubject(event) {
        event.preventDefault()

        console.log('SUBMITTING SUBJECT RENAME')
        const trimmedName =
            subjectName.trim()

        if (!trimmedName) {
            return
        }

        try {
            const updatedSubject =
                await renameSubject(
                    subject.id,
                    trimmedName
                )

            setSubjectName(
                updatedSubject.name
            )

            setIsRenamingSubject(false)
        } catch (error) {
            console.error(
                'Could not rename subject:',
                error
            )
        }
    }

    function showPreviousPlanet() {
        setActiveIndex(
            (currentIndex) =>
                currentIndex === 0
                    ? planets.length - 1
                    : currentIndex - 1
        )
    }


    function showNextPlanet() {
        setActiveIndex(
            (currentIndex) =>
                currentIndex ===
                planets.length - 1
                    ? 0
                    : currentIndex + 1
        )
    }


    function getRelativePosition(index) {
        if (index === activeIndex) {
            return 'active'
        }

        if (planets.length === 2) {
            return 'next'
        }

        const previousIndex =
            (
                activeIndex -
                1 +
                planets.length
            ) % planets.length

        const nextIndex =
            (
                activeIndex +
                1
            ) % planets.length

        if (index === previousIndex) {
            return 'previous'
        }

        if (index === nextIndex) {
            return 'next'
        }

        return 'hidden'
    }

    if (planets.length === 0) {
        return (
            <section className="star-system">
                <header className="star-system-header">
                    <div className="star-system-identity">
                        <div
                            className="star-symbol"
                            aria-hidden="true"
                        >
                            ✦
                        </div>

                        <div>
                            <p className="star-system-label">
                                STAR SYSTEM
                            </p>

                            {isRenamingSubject ? (
                                <form
                                    className="star-name-form"
                                    onSubmit={handleRenameSubject}
                                >
                                    <input
                                        type="text"
                                        value={subjectName}
                                        onChange={(event) => {
                                            setSubjectName(
                                                event.target.value
                                            )
                                        }}
                                        autoFocus
                                        onKeyDown={(event) => {
                                            if (event.key === 'Escape') {
                                                setSubjectName(
                                                    subject.name
                                                )

                                                setIsRenamingSubject(false)
                                            }
                                        }}
                                    />
                                </form>
                            ) : (
                                <button
                                    type="button"
                                    className="star-name-button"
                                    onClick={() => {
                                        setIsRenamingSubject(true)
                                    }}
                                    title="Rename star"
                                >
                                    {subjectName}
                                </button>
                            )}
                        </div>
                    </div>

                    <p className="star-system-count">
                        {activeIndex + 1}
                        {' / '}
                        {planets.length}
                    </p>
                </header>

                <p className="empty-star-system">
                    No worlds have formed around
                    this star yet.
                </p>
            </section>
        )
    }


    const activePlanet =
        planets[activeIndex]


    return (
        <section className="star-system">
            <header className="star-system-header">
                <div className="star-system-identity">
                    <div
                        className="star-symbol"
                        aria-hidden="true"
                    >
                        ✦
                    </div>

                    <div className="star-system-title-group">
                        <p className="star-system-label">
                            STAR SYSTEM
                        </p>

                        {isRenamingSubject ? (
                            <form
                                className="star-name-form"
                                onSubmit={handleRenameSubject}
                            >
                                <input
                                    type="text"
                                    value={subjectName}
                                    onChange={(event) => {
                                        setSubjectName(
                                            event.target.value
                                        )
                                    }}
                                    autoFocus
                                    onKeyDown={(event) => {
                                        if (event.key === 'Escape') {
                                            setSubjectName(
                                                subject.name
                                            )

                                            setIsRenamingSubject(false)
                                        }
                                    }}
                                />
                            </form>
                        ) : (
                            <button
                                type="button"
                                className="star-name-button"
                                onClick={() => {
                                    setIsRenamingSubject(true)
                                }}
                            >
                                {subjectName}
                            </button>
                        )}

                        <Link
                            to={`/subjects/${subject.id}`}
                            className="star-system-link"
                        >
                            View system
                        </Link>
                    </div>
                </div>

                <p className="star-system-count">
                    {activeIndex + 1}
                    {' / '}
                    {planets.length}
                </p>
            </header>


            <div className="planet-carousel">
                {planets.length > 1 && (
                    <button
                        type="button"
                        className={
                            'carousel-control ' +
                            'carousel-control-left'
                        }
                        onClick={
                            showPreviousPlanet
                        }
                        aria-label={
                            'Show previous planet'
                        }
                    >
                        ←
                    </button>
                )}


                <div className="carousel-stage">
                    {planets.map(
                        (planet, index) => {
                            const position =
                                getRelativePosition(
                                    index
                                )

                            const className =
                                `carousel-card ${position}`

                            if (position === 'active') {
                                return (
                                    <Link
                                        key={planet.id}
                                        to={`/planets/${planet.id}`}
                                        className={className}
                                        aria-label={`Open ${planet.name}`}
                                    >
                                        <PlanetCard planet={planet}/>
                                    </Link>
                                )
                            }

                            if (
                                position === 'previous' ||
                                position === 'next'
                            ) {
                                return (
                                    <button
                                        key={planet.id}
                                        type="button"
                                        className={className}
                                        onClick={() => {
                                            setActiveIndex(index)
                                        }}
                                        aria-label={`Select ${planet.name}`}
                                    >
                                        <PlanetCard planet={planet}/>
                                    </button>
                                )
                            }

                            return (
                                <div
                                    key={planet.id}
                                    className={className}
                                    aria-hidden="true"
                                >
                                    <PlanetCard planet={planet}/>
                                </div>
                            )
                        }
                    )}
                </div>


                {planets.length > 1 && (
                    <button
                        type="button"
                        className={
                            'carousel-control ' +
                            'carousel-control-right'
                        }
                        onClick={
                            showNextPlanet
                        }
                        aria-label={
                            'Show next planet'
                        }
                    >
                        →
                    </button>
                )}
            </div>


            <div className="carousel-details">
                <p className="carousel-status">
                    {activePlanet.stage ===
                    'COMPLETE'
                        ? 'STABILIZED WORLD'
                        : 'CURRENT WORLD'}
                </p>

                <h3>
                    {activePlanet.name}
                </h3>

                <StageChip stage={activePlanet.stage}/>

                <div className="carousel-progress-header">
                    <span>
                        <b>{activePlanet.accumulatedFocusMinutes}</b>
                        {' minutes'}
                    </span>

                    <span>
                        {Math.round(
                            activePlanet
                                .progressPercentage
                        )}
                        %
                    </span>
                </div>

                <XpMeter percentage={activePlanet.progressPercentage}/>

                <p className="carousel-hint">
                    Select the world to view its
                    mission log.
                </p>
            </div>
        </section>
    )
}


export default StarSystemCarousel
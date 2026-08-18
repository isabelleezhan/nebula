import {useEffect, useState} from 'react'
import AppNav from '../components/AppNav'
import {createSubject, getSubjects} from '../api/subjectApi.js'
import {getActivePlanet, renamePlanet} from '../api/planetApi.js'
import {recordFocusSession} from '../api/focusSessionApi'
import '../styles/OrbitPage.css'
import PixelPlanet from "../components/PixelPlanet.jsx";
import StageChip from "../components/StageChip.jsx";
import XpMeter from "../components/XpMeter.jsx";
import {getPlanetGlowColor} from "../pixel-planets/src/planetVisuals.js";


function OrbitPage() {
    const ACTIVE_SESSION_KEY =
        'nebulaActiveFocusSession'

    //
    // const DEBUG_STAGES = [
    //     'BARREN',
    //     'ATMOSPHERE',
    //     'TERRAIN',
    //     'BIOSPHERE',
    //     'CIVILIZATION',
    //     'COMPLETE'
    // ]
    //
    // const [debugStageIndex, setDebugStageIndex] =
    //     useState(null)
    //

    const [subjects, setSubjects] = useState([])
    const [selectedSubjectId, setSelectedSubjectId] = useState('')

    const [planet, setPlanet] = useState(null)

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const [isCreatingSubject, setIsCreatingSubject] = useState(false)
    const [newSubjectName, setNewSubjectName] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [elapsedSeconds, setElapsedSeconds] = useState(0)
    const [accumulatedSeconds, setAccumulatedSeconds] = useState(0)

    const [isFocusing, setIsFocusing] = useState(false)
    const [isPaused, setIsPaused] = useState(false)

    const [originalSessionStartedAt, setOriginalSessionStartedAt] = useState(null)
    const [sessionStartedAt, setSessionStartedAt] = useState(null)
    const [isSavingSession, setIsSavingSession] = useState(false)

    const [isRenamingPlanet, setIsRenamingPlanet] =
        useState(false)
    const [planetName, setPlanetName] =
        useState('')

    useEffect(() => {
        const savedSession =
            localStorage.getItem(
                ACTIVE_SESSION_KEY
            )

        if (!savedSession) {
            return
        }

        try {
            const parsedSession =
                JSON.parse(savedSession)

            setSelectedSubjectId(
                String(
                    parsedSession.subjectId
                )
            )

            setAccumulatedSeconds(
                parsedSession.accumulatedSeconds
            )

            setIsPaused(
                parsedSession.isPaused
            )

            setIsFocusing(true)

            if (
                parsedSession.originalSessionStartedAt
            ) {
                setOriginalSessionStartedAt(
                    new Date(
                        parsedSession.originalSessionStartedAt
                    )
                )
            }
            if (
                parsedSession.sessionStartedAt
            ) {
                setSessionStartedAt(
                    new Date(
                        parsedSession
                            .sessionStartedAt
                    )
                )
            } else {
                setSessionStartedAt(null)

                setElapsedSeconds(
                    parsedSession
                        .accumulatedSeconds
                )
            }
        } catch {
            localStorage.removeItem(
                ACTIVE_SESSION_KEY
            )
        }
    }, [])

    useEffect(() => {
        async function loadSubjects() {
            try {
                setError('')

                const loadedSubjects = await getSubjects()

                setSubjects(loadedSubjects)

                setSelectedSubjectId(
                    currentSubjectId => {
                        if (currentSubjectId) {
                            return currentSubjectId
                        }

                        if (loadedSubjects.length === 0) {
                            return ''
                        }

                        return String(
                            loadedSubjects[0].id
                        )
                    }
                )
            } catch (error) {
                setError(error.message)
            } finally {
                setIsLoading(false)
            }
        }

        void loadSubjects()
    }, [])


    useEffect(() => {
        if (!selectedSubjectId) {
            setPlanet(null)
            return
        }

        async function loadActivePlanet() {
            try {
                setError('')

                const activePlanet = await getActivePlanet(selectedSubjectId)

                setPlanet(activePlanet)
                setPlanetName(activePlanet.name)
            } catch (error) {
                setError(error.message)
                setPlanet(null)
            }
        }

        void loadActivePlanet()
    }, [selectedSubjectId])

    useEffect(() => {
        if (!isFocusing || !planet) {
            return
        }

        const activeSession = {
            planetId: planet.id,

            subjectId:
            selectedSubjectId,

            accumulatedSeconds,

            originalSessionStartedAt:
                originalSessionStartedAt
                    ? originalSessionStartedAt.toISOString()
                    : null,

            sessionStartedAt:
                sessionStartedAt
                    ? sessionStartedAt.toISOString()
                    : null,

            isPaused
        }

        localStorage.setItem(
            ACTIVE_SESSION_KEY,
            JSON.stringify(activeSession)
        )
    }, [
        isFocusing,
        planet,
        selectedSubjectId,
        accumulatedSeconds,
        originalSessionStartedAt,
        sessionStartedAt,
        isPaused
    ])


    useEffect(() => {
        if (
            !isFocusing ||
            isPaused ||
            !sessionStartedAt
        ) {
            return
        }

        function updateElapsedTime() {
            const currentRunSeconds =
                Math.floor(
                    (
                        Date.now() -
                        sessionStartedAt.getTime()
                    ) / 1000
                )

            setElapsedSeconds(
                accumulatedSeconds +
                currentRunSeconds)
        }

        updateElapsedTime()

        const intervalId =
            window.setInterval(
                updateElapsedTime,
                1000
            )

        return () => {
            window.clearInterval(intervalId)
        }
    }, [
        isFocusing,
        isPaused,
        sessionStartedAt,
        accumulatedSeconds
    ])

    function formatLocalDateTime(date) {
        const year = date.getFullYear()

        const month = String(
            date.getMonth() + 1
        ).padStart(2, '0')

        const day = String(
            date.getDate()
        ).padStart(2, '0')

        const hours = String(
            date.getHours()
        ).padStart(2, '0')

        const minutes = String(
            date.getMinutes()
        ).padStart(2, '0')

        const seconds = String(
            date.getSeconds()
        ).padStart(2, '0')

        return (
            `${year}-${month}-${day}` +
            `T${hours}:${minutes}:${seconds}`
        )
    }

    async function handleCreateSubject(event) {
        event.preventDefault()

        const trimmedName = newSubjectName.trim()

        if (!trimmedName) {
            setError('Please enter a subject name.')
            return
        }

        try {
            setError('')
            setIsCreating(true)

            const createdSubject = await createSubject(trimmedName)

            setSubjects((currentSubjects) => [...currentSubjects, createdSubject])

            setSelectedSubjectId(String(createdSubject.id))

            setNewSubjectName('')
            setIsCreatingSubject(false)
        } catch (error) {
            setError(error.message)
        } finally {
            setIsCreating(false)
        }
    }

    async function handleRenamePlanet(event) {
        event.preventDefault()

        if (!planet) {
            setError(
                'Could not determine the current planet.'
            )
            return
        }

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
            setIsRenamingPlanet(false)
        } catch (error) {
            setError(error.message)
        }
    }

    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600)

        const minutes = Math.floor((totalSeconds % 3600) / 60)

        const seconds = totalSeconds % 60

        const paddedMinutes = String(minutes).padStart(2, '0')

        const paddedSeconds = String(seconds).padStart(2, '0')

        if (hours > 0) {
            const paddedHours = String(hours).padStart(2, '0')

            return (`${paddedHours}:` + `${paddedMinutes}:` + `${paddedSeconds}`)
        }

        return (`${paddedMinutes}:` + `${paddedSeconds}`)
    }


    function handleBeginFocus() {
        setError('')
        setElapsedSeconds(0)
        setAccumulatedSeconds(0)

        const now = new Date()

        setOriginalSessionStartedAt(now)
        setSessionStartedAt(now)

        setIsFocusing(true)
        setIsPaused(false)
    }


    function handleTogglePause() {
        if (!isPaused) {
            const currentRunSeconds =
                Math.floor(
                    (
                        Date.now() -
                        sessionStartedAt.getTime()
                    ) / 1000
                )

            const updatedAccumulatedSeconds =
                accumulatedSeconds +
                currentRunSeconds

            setAccumulatedSeconds(
                updatedAccumulatedSeconds
            )

            setElapsedSeconds(
                updatedAccumulatedSeconds
            )

            setSessionStartedAt(null)
            setIsPaused(true)

            return
        }

        setSessionStartedAt(new Date())
        setIsPaused(false)
    }


    async function handleEndFocus() {
        const durationMinutes = Math.floor(elapsedSeconds / 60)

        if (durationMinutes < 1) {
            setError('Focus for at least one minute before ending the mission.')
            return
        }

        if (!planet || !originalSessionStartedAt) {
            setError('Could not determine the current focus session.')
            return
        }

        const endedAt = new Date()

        try {
            setError('')
            setIsPaused(true)
            setIsSavingSession(true)

            await recordFocusSession({
                planetId: planet.id,

                startedAt: formatLocalDateTime(originalSessionStartedAt),

                endedAt: formatLocalDateTime(endedAt),

                durationMinutes
            })

            const refreshedPlanet = await getActivePlanet(selectedSubjectId)

            setPlanet(refreshedPlanet)
            setPlanetName(refreshedPlanet.name)

            setIsFocusing(false)
            setIsPaused(false)

            setElapsedSeconds(0)
            setAccumulatedSeconds(0)

            setOriginalSessionStartedAt(null)
            setSessionStartedAt(null)

            localStorage.removeItem(
                ACTIVE_SESSION_KEY
            )
        } catch (error) {
            setError(error.message)
        } finally {
            setIsSavingSession(false)
        }
    }

    function closeSubjectForm() {
        setIsCreatingSubject(false)
        setNewSubjectName('')
    }

    const planetGlowColor =
        getPlanetGlowColor(planet)

    //
    // const displayedPlanet =
    //     debugStageIndex === null
    //         ? planet
    //         : {
    //             ...planet,
    //             stage: DEBUG_STAGES[debugStageIndex]
    //         }
    //

    if (isLoading) {
        return (<p>Charting your orbit...</p>)
    }


    return (
        <div
            className="orbit-page"
        >
            <AppNav/>

            <main className="orbit-main">
                <section className="orbit-header">
                    <p className="orbit-eyebrow">
                        CURRENT ORBIT
                    </p>

                    {subjects.length > 0 && (<>
                        <div className="subject-selector-wrap">
                            <select
                                className="subject-selector"
                                value={selectedSubjectId}
                                onChange={(event) => {
                                    setSelectedSubjectId(event.target.value)
                                }}
                                disabled={isFocusing}
                            >
                                {subjects.map((subject) => (<option
                                    key={subject.id}
                                    value={subject.id}
                                >
                                    {subject.name}
                                </option>))}
                            </select>
                        </div>

                        <button
                            type="button"
                            className="add-subject-button"
                            onClick={() => {
                                setIsCreatingSubject(true)
                            }}
                            disabled={isFocusing}
                        >
                            + New star
                        </button>
                    </>)}
                </section>


                {error && (<p className="orbit-error">
                    {error}
                </p>)}


                {isCreatingSubject && subjects.length > 0 && (<form
                    className={'create-subject-form ' + 'create-subject-panel'}
                    onSubmit={handleCreateSubject}
                >
                    <label
                        htmlFor={'additional-subject-name'}
                    >
                        Create a new star
                    </label>

                    <input
                        id={'additional-subject-name'}
                        type="text"
                        placeholder="MATH 101"
                        value={newSubjectName}
                        onChange={(event) => {
                            setNewSubjectName(event.target.value)
                        }}
                        autoFocus
                        required
                    />

                    <div
                        className={'create-subject-actions'}
                    >
                        <button
                            type="button"
                            className={'secondary-button'}
                            onClick={closeSubjectForm}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isCreating}
                        >
                            {isCreating ? 'Creating...' : 'Create star'}
                        </button>
                    </div>
                </form>)}


                {subjects.length === 0 ? (<section className="empty-orbit">
                    {!isCreatingSubject ? (<>
                        <p>
                            You have not created
                            a star yet.
                        </p>

                        <button
                            type="button"
                            className="btn btn-lg btn-primary"
                            onClick={() => {
                                setIsCreatingSubject(true)
                            }}
                        >
                            Create your first subject
                        </button>
                    </>) : (<form
                        className={'create-subject-form'}
                        onSubmit={handleCreateSubject}
                    >
                        <label
                            htmlFor={'new-subject-name'}
                        >
                            Name your first star
                        </label>

                        <input
                            id="new-subject-name"
                            type="text"
                            placeholder="CPSC 213"
                            value={newSubjectName}
                            onChange={(event) => {
                                setNewSubjectName(event.target.value)
                            }}
                            autoFocus
                            required
                        />

                        <div
                            className={'create-subject-actions'}
                        >
                            <button
                                type="button"
                                className={'secondary-button'}
                                onClick={closeSubjectForm}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isCreating}
                            >
                                {isCreating ? 'Creating...' : 'Create star'}
                            </button>
                        </div>
                    </form>)}
                </section>) : (<section className="current-world">
                    <div
                        className="planet-scene"
                        style={{
                            '--planet-glow':
                            planetGlowColor
                        }}
                    >
                        <PixelPlanet planet={planet}/>
                    </div>

                    <div className="world-details">
                        <p className="world-label">
                            CURRENT WORLD
                        </p>


                        {isRenamingPlanet ? (
                            <form
                                className="orbit-planet-name-form"
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
                                    onKeyDown={(event) => {
                                        if (event.key === 'Escape') {
                                            setPlanetName(
                                                planet.name
                                            )

                                            if (planet) {
                                                setPlanetName(planet.name)
                                            }

                                            setIsRenamingPlanet(false)
                                        }
                                    }}
                                />
                            </form>
                        ) : (
                            <button
                                type="button"
                                className="orbit-planet-name-button"
                                onClick={() => {
                                    setIsRenamingPlanet(true)
                                }}
                                title="Rename planet"
                            >
                                {planet?.name || 'Loading world...'}
                            </button>
                        )}


                        <StageChip stage={planet?.stage || 'BARREN'}/>

                        <div
                            className="world-progress"
                        >
                            <div
                                className={'progress-header'}
                            >
                  <span>
                    <b>{planet?.accumulatedFocusMinutes ?? 0}</b> / {planet?.requiredFocusMinutes ?? 600} minutes
                    </span>
                                <span>
                        {Math.round(planet?.progressPercentage ?? 0)}%
                                    </span>
                            </div>

                            <XpMeter percentage={planet?.progressPercentage ?? 0}/>
                        </div>

                        {!isFocusing ? (<button
                            type="button"
                            className={'btn btn-lg btn-primary begin-focus-button'}
                            onClick={handleBeginFocus}
                            disabled={!planet}
                        >
                            {planet?.accumulatedFocusMinutes > 1 ? 'Resume orbit' : 'Begin orbit'}
                        </button>) : (<div
                            className={'focus-session'}
                        >
                            <p
                                className={'focus-timer'}
                            >
                                {formatTime(elapsedSeconds)}
                            </p>

                            <p
                                className={
                                    isPaused
                                        ? 'focus-status paused'
                                        : 'focus-status live'
                                }
                            >
                                <span className="focus-status-dot" aria-hidden="true"/>
                                {isPaused ? 'Orbit paused' : 'Mission in progress'}
                            </p>

                            <div
                                className={'focus-actions'}
                            >
                                <button
                                    type="button"
                                    className="btn btn-lg btn-primary pause-focus-button"
                                    onClick={handleTogglePause}
                                    disabled={isSavingSession}
                                >
                                    {isPaused ? 'Resume' : 'Pause'}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-lg btn-ghost end-focus-button"
                                    onClick={handleEndFocus}
                                    disabled={isSavingSession}
                                >
                                    {isSavingSession ? 'Saving mission...' : 'End mission'}
                                </button>

                                {/*<button*/}
                                {/*    type="button"*/}
                                {/*    onClick={() => {*/}
                                {/*        setDebugStageIndex(current => {*/}
                                {/*            if (current === null) {*/}
                                {/*                return 0*/}
                                {/*            }*/}

                                {/*            return (*/}
                                {/*                current + 1*/}
                                {/*            ) % DEBUG_STAGES.length*/}
                                {/*        })*/}
                                {/*    }}*/}
                                {/*>*/}
                                {/*    Preview next stage*/}
                                {/*</button>*/}
                                {/*<button*/}
                                {/*    type="button"*/}
                                {/*    onClick={() => {*/}
                                {/*        setDebugStageIndex(null)*/}
                                {/*    }}*/}
                                {/*>*/}
                                {/*    Use real stage*/}
                                {/*</button>*/}
                            </div>
                        </div>)}
                    </div>
                </section>)}
            </main>
        </div>
    )
}

export default OrbitPage


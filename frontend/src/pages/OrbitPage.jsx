import {
    useEffect,
    useState
} from 'react'

import AppNav from '../components/AppNav'

import {
    createSubject,
    getSubjects
} from '../api/subjectApi'

import {getActivePlanet} from '../api/planetApi'
import '../styles/OrbitPage.css'


function OrbitPage() {
    const [subjects, setSubjects] = useState([])

    const [
        selectedSubjectId,
        setSelectedSubjectId
    ] = useState('')

    const [planet, setPlanet] = useState(null)

    const [isLoading, setIsLoading] =
        useState(true)

    const [error, setError] =
        useState('')

    const [
        isCreatingSubject,
        setIsCreatingSubject
    ] = useState(false)

    const [
        newSubjectName,
        setNewSubjectName
    ] = useState('')

    const [isCreating, setIsCreating] =
        useState(false)

    const [
        elapsedSeconds,
        setElapsedSeconds
    ] = useState(0)

    const [isFocusing, setIsFocusing] =
        useState(false)

    const [isPaused, setIsPaused] =
        useState(false)


    useEffect(() => {
        async function loadSubjects() {
            try {
                setError('')

                const loadedSubjects =
                    await getSubjects()

                setSubjects(loadedSubjects)

                if (loadedSubjects.length > 0) {
                    setSelectedSubjectId(
                        String(loadedSubjects[0].id)
                    )
                }
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

                const activePlanet =
                    await getActivePlanet(
                        selectedSubjectId
                    )

                setPlanet(activePlanet)
            } catch (error) {
                setError(error.message)
                setPlanet(null)
            }
        }

        void loadActivePlanet()
    }, [selectedSubjectId])


    useEffect(() => {
        if (!isFocusing || isPaused) {
            return
        }

        const intervalId =
            window.setInterval(() => {
                setElapsedSeconds(
                    (currentSeconds) =>
                        currentSeconds + 1
                )
            }, 1000)

        return () => {
            window.clearInterval(intervalId)
        }
    }, [isFocusing, isPaused])


    async function handleCreateSubject(event) {
        event.preventDefault()

        const trimmedName =
            newSubjectName.trim()

        if (!trimmedName) {
            setError(
                'Please enter a subject name.'
            )

            return
        }

        try {
            setError('')
            setIsCreating(true)

            const createdSubject =
                await createSubject(trimmedName)

            setSubjects(
                (currentSubjects) => [
                    ...currentSubjects,
                    createdSubject
                ]
            )

            setSelectedSubjectId(
                String(createdSubject.id)
            )

            setNewSubjectName('')
            setIsCreatingSubject(false)
        } catch (error) {
            setError(error.message)
        } finally {
            setIsCreating(false)
        }
    }


    function formatTime(totalSeconds) {
        const hours = Math.floor(
            totalSeconds / 3600
        )

        const minutes = Math.floor(
            (totalSeconds % 3600) / 60
        )

        const seconds =
            totalSeconds % 60

        const paddedMinutes =
            String(minutes).padStart(2, '0')

        const paddedSeconds =
            String(seconds).padStart(2, '0')

        if (hours > 0) {
            const paddedHours =
                String(hours).padStart(2, '0')

            return (
                `${paddedHours}:` +
                `${paddedMinutes}:` +
                `${paddedSeconds}`
            )
        }

        return (
            `${paddedMinutes}:` +
            `${paddedSeconds}`
        )
    }


    function handleBeginFocus() {
        setElapsedSeconds(0)
        setIsFocusing(true)
        setIsPaused(false)
    }


    function handleTogglePause() {
        setIsPaused(
            (currentValue) =>
                !currentValue
        )
    }


    function handleEndFocus() {
        setIsFocusing(false)
        setIsPaused(false)
        setElapsedSeconds(0)
    }


    function closeSubjectForm() {
        setIsCreatingSubject(false)
        setNewSubjectName('')
    }


    if (isLoading) {
        return (
            <p>
                Charting your orbit...
            </p>
        )
    }


    return (
        <div className="orbit-page">
            <AppNav/>

            <main className="orbit-main">
                <section className="orbit-header">
                    <p className="orbit-eyebrow">
                        CURRENT ORBIT
                    </p>

                    {subjects.length > 0 && (
                        <>
                            <select
                                className="subject-selector"
                                value={selectedSubjectId}
                                onChange={(event) => {
                                    setSelectedSubjectId(
                                        event.target.value
                                    )
                                }}
                                disabled={isFocusing}
                            >
                                {subjects.map(
                                    (subject) => (
                                        <option
                                            key={subject.id}
                                            value={subject.id}
                                        >
                                            {subject.name}
                                        </option>
                                    )
                                )}
                            </select>

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
                        </>
                    )}
                </section>


                {error && (
                    <p className="orbit-error">
                        {error}
                    </p>
                )}


                {isCreatingSubject &&
                    subjects.length > 0 && (
                        <form
                            className={
                                'create-subject-form ' +
                                'create-subject-panel'
                            }
                            onSubmit={
                                handleCreateSubject
                            }
                        >
                            <label
                                htmlFor={
                                    'additional-subject-name'
                                }
                            >
                                Create a new star
                            </label>

                            <input
                                id={
                                    'additional-subject-name'
                                }
                                type="text"
                                placeholder="MATH 101"
                                value={newSubjectName}
                                onChange={(event) => {
                                    setNewSubjectName(
                                        event.target.value
                                    )
                                }}
                                autoFocus
                                required
                            />

                            <div
                                className={
                                    'create-subject-actions'
                                }
                            >
                                <button
                                    type="button"
                                    className={
                                        'secondary-button'
                                    }
                                    onClick={
                                        closeSubjectForm
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isCreating}
                                >
                                    {isCreating
                                        ? 'Creating...'
                                        : 'Create star'}
                                </button>
                            </div>
                        </form>
                    )}


                {subjects.length === 0 ? (
                    <section className="empty-orbit">
                        {!isCreatingSubject ? (
                            <>
                                <p>
                                    You have not created
                                    a star yet.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreatingSubject(
                                            true
                                        )
                                    }}
                                >
                                    Create your first subject
                                </button>
                            </>
                        ) : (
                            <form
                                className={
                                    'create-subject-form'
                                }
                                onSubmit={
                                    handleCreateSubject
                                }
                            >
                                <label
                                    htmlFor={
                                        'new-subject-name'
                                    }
                                >
                                    Name your first star
                                </label>

                                <input
                                    id="new-subject-name"
                                    type="text"
                                    placeholder="CPSC 213"
                                    value={newSubjectName}
                                    onChange={(event) => {
                                        setNewSubjectName(
                                            event.target.value
                                        )
                                    }}
                                    autoFocus
                                    required
                                />

                                <div
                                    className={
                                        'create-subject-actions'
                                    }
                                >
                                    <button
                                        type="button"
                                        className={
                                            'secondary-button'
                                        }
                                        onClick={
                                            closeSubjectForm
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isCreating}
                                    >
                                        {isCreating
                                            ? 'Creating...'
                                            : 'Create star'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </section>
                ) : (
                    <section className="current-world">
                        <div className="planet-scene">
                            <img
                                src="../../public/4158376800-cropped.gif"
                                alt="Current planet"
                                className="planet-placeholder-image"
                            />
                        </div>

                        <div className="world-details">
                            <p className="world-label">
                                CURRENT WORLD
                            </p>

                            <h1>
                                {planet?.name ||
                                    'Unknown World'}
                            </h1>

                            <p className="world-stage">
                                {planet?.stage ||
                                    'BARREN'}
                            </p>

                            <div
                                className="world-progress"
                            >
                                <div
                                    className={
                                        'progress-header'
                                    }
                                >
                  <span>
                    {planet?.focusMinutes ??
                        0}{' '}
                      minutes
                  </span>

                                    <span>
                    600 minutes
                  </span>
                                </div>

                                <div
                                    className={
                                        'progress-track'
                                    }
                                >
                                    <div
                                        className={
                                            'progress-fill'
                                        }
                                        style={{
                                            width: `${
                                                Math.min(
                                                    (
                                                        (
                                                            planet
                                                                ?.focusMinutes ??
                                                            0
                                                        ) /
                                                        600
                                                    ) * 100,
                                                    100
                                                )
                                            }%`
                                        }}
                                    />
                                </div>
                            </div>

                            {!isFocusing ? (
                                <button
                                    type="button"
                                    className={
                                        'begin-focus-button'
                                    }
                                    onClick={
                                        handleBeginFocus
                                    }
                                    disabled={!planet}
                                >
                                    Begin orbit
                                </button>
                            ) : (
                                <div
                                    className={
                                        'focus-session'
                                    }
                                >
                                    <p
                                        className={
                                            'focus-timer'
                                        }
                                    >
                                        {formatTime(
                                            elapsedSeconds
                                        )}
                                    </p>

                                    <p
                                        className={
                                            'focus-status'
                                        }
                                    >
                                        {isPaused
                                            ? 'ORBIT PAUSED'
                                            : 'MISSION IN PROGRESS'}
                                    </p>

                                    <div
                                        className={
                                            'focus-actions'
                                        }
                                    >
                                        <button
                                            type="button"
                                            className={
                                                'pause-focus-button'
                                            }
                                            onClick={
                                                handleTogglePause
                                            }
                                        >
                                            {isPaused
                                                ? 'Resume'
                                                : 'Pause'}
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                'end-focus-button'
                                            }
                                            onClick={
                                                handleEndFocus
                                            }
                                        >
                                            End mission
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </div>
    )
}

export default OrbitPage


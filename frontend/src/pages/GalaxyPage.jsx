import {useEffect, useState} from 'react'
import AppNav from '../components/AppNav'
import {getSubjects} from '../api/subjectApi'
import {getPlanetsForSubject} from '../api/planetApi'
import '../styles/GalaxyPage.css'
import {Link} from "react-router";

import StarSystemCarousel from '../components/StarSystemCarousel'
import '../styles/StarSystem.css'

function GalaxyPage() {
    const [systems, setSystems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadGalaxy() {
            try {
                setError('')
                const loadedSubjects = await getSubjects()
                const loadedSystems = await Promise.all(loadedSubjects.map(async (subject) => {
                    const planets = await getPlanetsForSubject(subject.id)
                    return {
                        subject, planets
                    }
                }))
                setSystems(loadedSystems)
            } catch (error) {
                console.error('Failed to load Galaxy', error)
                setError(error.message)
                setSystems([])
            } finally {
                setIsLoading(false)
            }
        }

        void loadGalaxy()
    }, [])

    function getTotalPlanetCount() {
        return systems.reduce((total, system) => total + system.planets.length, 0)
    }


    if (isLoading) {
        return (<div className="galaxy-page">
            <AppNav/>

            <main className="galaxy-main">
                <p className="galaxy-loading">
                    Mapping your galaxy...
                </p>
            </main>
        </div>)
    }

    return (<div className="galaxy-page">
            <AppNav/>
            <main className="galaxy-main">
                {/*<header className="galaxy-header">*/}
                {/*    {systems.length > 0 && (<div className="galaxy-summary">*/}
                {/*            <span>*/}
                {/*                {systems.length}{' '}*/}
                {/*                {systems.length === 1 ? 'star' : 'stars'}*/}
                {/*            </span>*/}
                {/*        <span aria-hidden="true">*/}
                {/*        ·*/}
                {/*    </span>*/}

                {/*        <span>*/}
                {/*                {getTotalPlanetCount()}{' '}*/}
                {/*            {getTotalPlanetCount() === 1 ? 'world' : 'worlds'}*/}
                {/*            </span>*/}
                {/*    </div>)}*/}
                {/*</header>*/}

                {error && (<p className="galaxy-error">
                    {error}
                </p>)}

                {systems.length === 0 ? (
                    <section className="empty-galaxy">
                        <p>
                            Your galaxy is still waiting for its first star.
                        </p>
                        <Link
                            to="/orbit"
                            className="btn btn-lg btn-primary empty-galaxy-link"
                        >
                            Create a star in Orbit
                        </Link>
                    </section>
                ) : (
                    <div className="star-system-list">
                        {systems.map((system) => (
                            <StarSystemCarousel
                                key={system.subject.id}
                                subject={system.subject}
                                planets={system.planets}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default GalaxyPage

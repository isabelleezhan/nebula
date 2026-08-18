import '../styles/LandingPage.css'
import {Link} from 'react-router'
import PixelStar from '../components/PixelStar'

function LandingPage() {
    return (
        <div className="landing-page">

            <header className="landing-nav">
                <Link
                    to="/"
                    className="landing-logo">
                    NEBULA
                </Link>

                <div className="landing-actions">
                    <Link
                        to="/login"
                        className="btn btn-ghost"
                    >
                        Log in
                    </Link>

                    <Link
                        to="/register"
                        className="btn btn-primary"
                    >
                        Get started
                    </Link>
                </div>
            </header>

            <main className="landing-main">

                <section className="landing-hero">
                    <p className="landing-eyebrow">
                        Galactic focus protocol
                    </p>

                    <h1>
                        Grow your universe
                        <br/>
                        through focus.
                    </h1>

                    <p className="landing-description">
                        Every session evolves a planet. Every planet joins
                        a system. Nothing decays &mdash; time spent
                        focused is the only currency here.
                    </p>

                    <div className="landing-cta-row">
                        <Link to="/register" className="btn btn-lg btn-primary">
                            Get started &rarr;
                        </Link>

                        <Link to="/login" className="btn btn-lg btn-ghost">
                            Log in
                        </Link>
                    </div>

                    <ol className="landing-loop">
                        <li>
                            <span className="landing-loop-label">Study</span>
                            time spent focused
                        </li>

                        <li>
                            <span className="landing-loop-label">Evolve</span>
                            a planet grows in stages
                        </li>

                        <li>
                            <span className="landing-loop-label">Stabilize</span>
                            it joins your star system
                        </li>
                    </ol>
                </section>

                <section className="landing-planet-area">
                    <div className="planet-scene">
                        <div className="orbit-ring outer" aria-hidden="true"/>
                        <div className="orbit-ring inner" aria-hidden="true"/>

                        <div className="planet-glow"/>

                        <div className="landing-star">
                            <PixelStar/>
                        </div>

                        <div className="planet-moon"/>
                    </div>
                </section>

            </main>

        </div>
    )
}

export default LandingPage
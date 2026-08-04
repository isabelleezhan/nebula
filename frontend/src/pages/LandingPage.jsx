import '../styles/LandingPage.css'
import {Link} from 'react-router'

function LandingPage() {
    return (
        <div className="landing-page">

            <header className="landing-nav">
                <Link
                    to="/"
                    className="auth-logo">
                    NEBULA
                </Link>

                <div className="landing-actions">
                    <Link
                        to="/login"
                        className="login-button"
                    >
                        Log in
                    </Link>

                    <Link
                        to="/register"
                        className="launch-button"
                    >
                        Get started
                    </Link>
                </div>
            </header>

            <main className="landing-main">

                <section className="landing-hero">
                    <p className="landing-eyebrow">
                        GALACTIC FOCUS.
                    </p>

                    <h1>
                        Grow your universe
                        <br/>
                        through focus.
                    </h1>

                    <p className="landing-description">
                        Focus to evolve planets.
                        <br/>
                        Expand your galaxy,
                        and discover where your time takes you.
                    </p>
                </section>

                <section className="landing-planet-area">
                    <div className="planet-scene">
                        <div className="planet-glow"/>

                        <img src="../../public/4158376800-cropped.gif"
                             alt="Planet"
                             className="planet-placeholder-image"/>

                        <div className="planet-moon"/>
                    </div>
                </section>

            </main>

        </div>
    )
}

export default LandingPage
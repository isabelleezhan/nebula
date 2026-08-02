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
                        YOUR FOCUS. YOUR UNIVERSE.
                    </p>

                    <h1>
                        Grow your universe
                        <br/>
                        through focus.
                    </h1>

                    <p className="landing-description">
                        Focus sessions shape evolving worlds.
                        Build planets, expand your galaxy,
                        and discover where your time takes you.
                    </p>

                    <button className="hero-launch-button">
                        Begin your journey
                    </button>
                </section>

                <section className="landing-planet-area">
                    <div className="planet-placeholder">
                        PLANET
                    </div>
                </section>

            </main>

        </div>
    )
}

export default LandingPage
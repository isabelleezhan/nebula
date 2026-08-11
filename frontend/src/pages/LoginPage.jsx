import '../styles/AuthPage.css'
import {Link, useNavigate} from 'react-router'
import {useState} from 'react'
import {useAuth} from '../context/AuthContext'
import PixelStar from '../components/PixelStar.jsx'

function LoginPage() {
    const navigate = useNavigate()
    const {login} = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()

        setError('')

        try {
            setIsSubmitting(true)

            const user = await login(
                email,
                password
            )
            console.log('Logged in user:', user)

            navigate('/orbit')
        } catch (error) {
            setError(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="auth-page">

            <header className="auth-nav">
                <Link
                    to="/"
                    className="auth-logo">
                    NEBULA
                </Link>
            </header>

            <main className="auth-main">

                <section className="auth-panel">

                    <p className="auth-eyebrow">
                        WELCOME BACK
                    </p>

                    <h1>
                        Return to orbit.
                    </h1>

                    <p className="auth-description">
                        Your worlds are waiting.
                    </p>

                    <form className="auth-form"
                          onSubmit={handleSubmit}>

                        <div className="form-field">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                placeholder="Your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? 'Entering orbit...'
                                : 'Enter orbit'}
                        </button>

                    </form>

                    <p className="auth-switch">
                        New to Nebula?{' '}
                        <Link to="/register">
                            Begin your journey
                        </Link>
                    </p>

                </section>

                <section className="auth-visual">
                    <div className="auth-orbit">

                        <div className="auth-glow"/>
                        <div className="planet-image">
                            <PixelStar color={"yellow"}/>
                        </div>

                    </div>
                </section>

            </main>

        </div>
    )
}

export default LoginPage
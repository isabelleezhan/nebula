import '../styles/AuthPage.css'
import {Link, useNavigate} from 'react-router'
import {useState} from 'react'
import {registerUser} from '../api/authApi'
import PixelStar from '../components/PixelStar.jsx'

function RegisterPage() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] =
        useState(false)

    async function handleSubmit(event) {
        event.preventDefault()

        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        try {
            setIsSubmitting(true)

            await registerUser(email, password)

            navigate('/login')
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
                    className="auth-logo"
                >
                    NEBULA
                </Link>
            </header>

            <main className="auth-main">
                <section className="auth-panel">
                    <p className="auth-eyebrow">
                        BEGIN YOUR JOURNEY
                    </p>

                    <h1>
                        Launch your universe.
                    </h1>

                    <p className="auth-description">
                        Create an account and begin shaping your first world.
                    </p>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-field">
                            <label htmlFor="register-email">
                                Email
                            </label>

                            <input
                                id="register-email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value)
                                }}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="register-password">
                                Password
                            </label>

                            <input
                                id="register-password"
                                type="password"
                                placeholder="At least 8 characters"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value)
                                }}
                                minLength={8}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="confirm-password">
                                Confirm password
                            </label>

                            <input
                                id="confirm-password"
                                type="password"
                                placeholder="Repeat your password"
                                value={confirmPassword}
                                onChange={(event) => {
                                    setConfirmPassword(event.target.value)
                                }}
                                minLength={8}
                                required
                            />
                        </div>

                        {error && (
                            <p className="auth-error">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="btn btn-lg btn-primary auth-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? 'Launching...'
                                : 'Launch'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already exploring?{' '}

                        <Link to="/login">
                            Return to orbit
                        </Link>
                    </p>
                </section>

                <section className="auth-visual">
                    <div className="auth-orbit">

                        <div className="auth-glow"/>

                        <div className="planet-image">
                            <PixelStar color={"red"}/>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default RegisterPage
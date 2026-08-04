import {NavLink, useNavigate} from 'react-router'
import {useAuth} from '../context/AuthContext'
import '../styles/AppNav.css'

function AppNav() {
    const navigate = useNavigate()

    const {
        user,
        logout
    } = useAuth()

    async function handleLogout() {
        try {
            await logout()
            navigate('/login')
        } catch (error) {
            console.error(
                'Logout failed:',
                error
            )
        }
    }

    return (
        <header className="app-nav">
            <NavLink
                to="/orbit"
                className="app-nav-logo"
            >
                NEBULA
            </NavLink>

            <nav className="app-nav-links">
                <NavLink
                    to="/orbit"
                    className={({isActive}) =>
                        isActive
                            ? 'app-nav-link active'
                            : 'app-nav-link'
                    }
                >
                    Orbit
                </NavLink>

                <NavLink
                    to="/galaxy"
                    className={({isActive}) =>
                        isActive
                            ? 'app-nav-link active'
                            : 'app-nav-link'
                    }
                >
                    Galaxy
                </NavLink>

                <NavLink
                    to="/insights"
                    className={({isActive}) =>
                        isActive
                            ? 'app-nav-link active'
                            : 'app-nav-link'
                    }
                >
                    Insights
                </NavLink>
            </nav>

            <div className="app-nav-user">
        <span className="app-nav-email">
          {user.email}
        </span>

                <button
                    type="button"
                    className="app-nav-logout"
                    onClick={handleLogout}
                >
                    Log out
                </button>
            </div>
        </header>
    )
}

export default AppNav
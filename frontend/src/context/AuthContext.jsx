import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react'

import {
    getCurrentUser,
    loginUser,
    logoutUser
} from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadCurrentUser() {
            try {
                const currentUser = await getCurrentUser()
                setUser(currentUser)
            } catch (error) {
                console.error(
                    'Could not load current user:',
                    error
                )

                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }

        loadCurrentUser()
    }, [])

    async function login(email, password) {
        const loggedInUser = await loginUser(
            email,
            password
        )

        setUser(loggedInUser)

        return loggedInUser
    }

    async function logout() {
        await logoutUser()
        setUser(null)
    }

    const value = {
        user,
        isLoading,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
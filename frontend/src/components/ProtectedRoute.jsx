import {Navigate} from 'react-router'
import {useAuth} from '../context/AuthContext'

function ProtectedRoute({children}) {
    const {
        user,
        isLoading
    } = useAuth()

    if (isLoading) {
        return <p>Entering orbit...</p>
    }

    if (!user) {
        return <Navigate to="/login" replace/>
    }
    return children;
}

export default ProtectedRoute
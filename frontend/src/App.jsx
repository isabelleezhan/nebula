import {BrowserRouter, Routes, Route} from 'react-router'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OrbitPage from './pages/OrbitPage'

import ProtectedRoute from './components/ProtectedRoute'
import {AuthProvider} from './context/AuthContext'

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route
                        path="/"
                        element={<LandingPage/>}
                    />

                    <Route
                        path="/login"
                        element={<LoginPage/>}
                    />

                    <Route
                        path="/register"
                        element={<RegisterPage/>}
                    />

                    <Route
                        path="/orbit"
                        element={
                            <ProtectedRoute>
                                <OrbitPage/>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App

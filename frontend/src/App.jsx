import {BrowserRouter, Route, Routes} from 'react-router'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OrbitPage from './pages/OrbitPage'
import GalaxyPage from './pages/GalaxyPage'
import PlanetDetailPage from './pages/PlanetDetailPage'
import SubjectDetailPage from './pages/SubjectDetailPage'

import ProtectedRoute from './components/ProtectedRoute'
import {AuthProvider} from './context/AuthContext'
import InsightsPage from "./pages/InsightsPage.jsx";

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

                    <Route
                        path="/galaxy"
                        element={
                            <ProtectedRoute>
                                <GalaxyPage/>
                            </ProtectedRoute>}
                    />

                    <Route
                        path="/planets/:planetId"
                        element={
                            <ProtectedRoute>
                                <PlanetDetailPage/>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/insights"
                        element={
                            <ProtectedRoute>
                                <InsightsPage/>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/subjects/:subjectId"
                        element={
                            <ProtectedRoute>
                                <SubjectDetailPage/>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App

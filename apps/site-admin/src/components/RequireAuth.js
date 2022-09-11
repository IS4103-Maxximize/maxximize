import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'


const RequireAuth = () => {
    const isAuth = useAuth()
    const location = useLocation()


    return (
        isAuth? <Outlet/> : <Navigate to="/login" state={{from: location}} replace />
    )
}

export default RequireAuth
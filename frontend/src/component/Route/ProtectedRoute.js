import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const ProtectedRoute = ({ isAuthenticated }) => {

    if (isAuthenticated === false) {
        return <Navigate to ='/login' />
    }
    return <Outlet />
}

export default ProtectedRoute

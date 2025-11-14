import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';


const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (<MainLayout>
        {children}
    </MainLayout>);
};

export default ProtectedRoute;
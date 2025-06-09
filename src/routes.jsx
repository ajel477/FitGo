import React from 'react';
import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import WorkoutPage from './pages/NewWorkout';
import WorkoutDetail from './pages/WorkoutDetail';
import Profile from './pages/Profile';
import FitnessTracker from './pages/FitnessTracker';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ResetPassword from './components/Auth/ResetPassword';
import UpdatePassword from './components/Auth/UpdatePassword';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import PublicRoute from './components/Auth/PublicRoute';
import WithingsCallback from './components/Withings/WithingsCallback';
import ErrorBoundary from './components/ErrorBoundary';

const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    element: <PublicRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'reset-password',
        element: <ResetPassword />
      },
      {
        path: 'update-password',
        element: <UpdatePassword />
      }
    ]
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'dashboard',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />
          },
          {
            path: 'workout',
            element: <WorkoutPage />
          },
          {
            path: 'workout/:id',
            element: <WorkoutDetail />,
            errorElement: <ErrorBoundary />
          },
          {
            path: 'profile',
            element: <Profile />
          },
          {
            path: 'fitness-tracker',
            element: <FitnessTracker />
          },
          {
            path: 'connect-withings',
            element: <WithingsCallback />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <ErrorBoundary />
  }
];

export const router = createBrowserRouter(routes);

export default router;

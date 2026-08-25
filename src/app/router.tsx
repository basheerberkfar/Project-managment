/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/components/dashboard-layout';
import { getFirstAccessibleSidebarLink } from '@/components/layout/components/sidebar-schema';
import type { Routes } from '@/types/routes-types';
import { getAuthToken } from '@/utils/helpers';

const Login = lazy(() => import('@/features/auth/page'));
const Dashboard = lazy(() => import('@/features/dashboard/page'));
const Clients = lazy(() => import('@/features/clients/page'));

const NotFound = lazy(() => import('@/features/not-found/page'));
const Roles = lazy(() => import('@/features/roles/page'));
const RolesAction = lazy(() => import('@/features/roles/page/form'));
const DisplayRole = lazy(() => import('@/features/roles/page/view'));
const Users = lazy(() => import('@/features/users/page'));
const UsersAction = lazy(() => import('@/features/users/page/form'));
const DisplayUser = lazy(() => import('@/features/users/page/view'));
const Departments = lazy(() => import('@/features/departments/page'));
const JobTitles = lazy(() => import('@/features/job-titles/page'));
const Projects = lazy(() => import('@/features/projects/page'));
const Finance = lazy(() => import('@/features/finance/page'));
const BillForm = lazy(() => import('@/features/finance/page/bill-form'));
const Renewals = lazy(() => import('@/features/finance/page/renewals'));
const Settings = lazy(() => import('@/features/settings/page'));
const Management = lazy(() => import('@/features/management/page'));
const CvAnalysis = lazy(() => import('@/features/cv-analysis/page'));
const Chats = lazy(() => import('@/features/chats/page'));

const isAuthenticated = () => !!getAuthToken();

const getDefaultProtectedPath = () => getFirstAccessibleSidebarLink();
// const isAuthenticated = () => true;

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  return !isAuthenticated() ? (
    children
  ) : (
    <Navigate to={getDefaultProtectedPath()} replace />
  );
};

export const publicRoutes: Routes[] = [
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
];

export const protectedRoutes: Routes[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to={getDefaultProtectedPath()} replace />,
      },
      { path: 'dashboard', element: <Dashboard /> },
    ],
  },
  {
    path: '/clients-list',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [{ path: '', element: <Clients /> }],
  },
  {
    path: '/projects',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <Projects /> },
      { path: ':id', element: <Projects /> },
    ],
  },
  {
    path: '/bills',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [{ path: '', element: <Finance type="bills" /> }],
  },
  {
    path: '/bonds',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [{ path: '', element: <Finance type="bonds" /> }],
  },
  {
    path: '/renewal',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [{ path: '', element: <Renewals /> }],
  },
  {
    path: '/action-bill',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [{ path: '', element: <BillForm /> }],
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [{ path: '', element: <Settings /> }],
  },
  {
    path: '/chats',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [{ path: '', element: <Chats /> }],
  },
  {
    path: '/cv-analysis',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [{ path: '', element: <CvAnalysis /> }],
  },
  {
    path: '/management/:resource',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [{ path: '', element: <Management /> }],
  },
  {
    path: '/users-roles',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'users', element: <Users /> },
      { path: 'users/:id', element: <UsersAction /> },
      { path: 'users/:id/display', element: <DisplayUser /> },
      { path: 'roles', element: <Roles /> },
      { path: 'roles/:id', element: <RolesAction /> },
      { path: 'roles/:id/display', element: <DisplayRole /> },
      { path: 'departments', element: <Departments /> },
      { path: 'job-titles', element: <JobTitles /> },
    ],
  },
];

export const notFoundRoute: Routes = {
  path: '*',
  element: <NotFound />,
};

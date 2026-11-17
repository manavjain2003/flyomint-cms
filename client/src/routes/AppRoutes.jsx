import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ResourceEditor from '../components/content/ResourceEditor.jsx';
import ResourceList from '../components/content/ResourceList.jsx';
import AdminLayout from '../components/layout/AdminLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import ChangePasswordPage from '../features/auth/ChangePasswordPage.jsx';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage.jsx';
import LoginPage from '../features/auth/LoginPage.jsx';
import ResetPasswordPage from '../features/auth/ResetPasswordPage.jsx';
import DashboardPage from '../features/dashboard/DashboardPage.jsx';
import MediaLibraryPage from '../features/media/MediaLibraryPage.jsx';
import ReportsPage from '../features/reports/ReportsPage.jsx';
import DuplicatesPage from '../features/seo/DuplicatesPage.jsx';
import { RESOURCES } from '../resources/index.js';
import ProtectedRoute from './ProtectedRoute.jsx';

/** Editors are sent back to the dashboard when they open an admin-only screen. */
function AdminOnly({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/" replace />;
}

const guard = (resource, element) => (resource.adminOnly ? <AdminOnly>{element}</AdminOnly> : element);

/** Every resource gets its own screen(s), generated from its definition. */
function resourceRoutes(resource) {
  const editor = guard(resource, <ResourceEditor key={resource.key} resource={resource} />);

  if (resource.kind !== 'collection') {
    return [<Route key={resource.key} path={resource.path} element={editor} />];
  }
  return [
    <Route key={`${resource.key}-list`} path={resource.path} element={guard(resource, <ResourceList key={resource.key} resource={resource} />)} />,
    <Route key={`${resource.key}-edit`} path={`${resource.path}/:id`} element={editor} />,
  ];
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/media" element={<MediaLibraryPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/seo/duplicates" element={<DuplicatesPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          {RESOURCES.flatMap(resourceRoutes)}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

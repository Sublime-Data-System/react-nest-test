import { Spin } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LaneDetailPage } from './pages/LaneDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RfpDetailPage } from './pages/RfpDetailPage';
import { RfpListPage } from './pages/RfpListPage';
import { useAuth } from './state/AuthContext';

export function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="centered-page">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="tenants" replace />} />
        <Route path="tenants" element={<RfpListPage />} />
        <Route path="tenants/:tenantId/rfps" element={<RfpListPage />} />
        <Route path="tenants/:tenantId/rfps/:rfpId" element={<RfpDetailPage />} />
        <Route
          path="tenants/:tenantId/rfp-lanes/:laneId"
          element={<LaneDetailPage />}
        />
      </Route>
    </Routes>
  );
}

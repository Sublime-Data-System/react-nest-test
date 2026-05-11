import { LogoutOutlined } from '@ant-design/icons';
import { Button, Layout, Select, Space, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { getTenants } from '../api/tenants';
import { useAsync } from '../hooks/useAsync';
import { useAuth } from '../state/AuthContext';

const { Header, Content } = Layout;

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { tenantId } = useParams();
  const tenants = useAsync(getTenants, []);

  const selectedTenant = useMemo(
    () => tenants.data?.find((tenant) => tenant.id === tenantId),
    [tenantId, tenants.data],
  );

  useEffect(() => {
    if (!tenantId && tenants.data?.length) {
      navigate(`/tenants/${tenants.data[0].id}/rfps`, { replace: true });
    }
  }, [navigate, tenantId, tenants.data]);

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <Space size="large">
          <Link to={selectedTenant ? `/tenants/${selectedTenant.id}/rfps` : '/'}>
            <Typography.Text className="brand">S2Q Interview</Typography.Text>
          </Link>
          <Select
            loading={tenants.loading}
            value={selectedTenant?.id}
            placeholder="Select tenant"
            style={{ width: 240 }}
            onChange={(nextTenantId) => navigate(`/tenants/${nextTenantId}/rfps`)}
            options={(tenants.data ?? []).map((tenant) => ({
              value: tenant.id,
              label: `${tenant.name} (${tenant.role})`,
            }))}
          />
        </Space>
        <Space>
          <Typography.Text>{user?.email}</Typography.Text>
          <Button
            icon={<LogoutOutlined />}
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
          >
            Logout
          </Button>
        </Space>
      </Header>
      <Content className="app-content">
        <Outlet />
      </Content>
    </Layout>
  );
}

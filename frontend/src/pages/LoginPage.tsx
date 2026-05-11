import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/client';
import { getTenants } from '../api/tenants';
import { useAuth } from '../state/AuthContext';

export function LoginPage() {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (token) {
    return <Navigate to="/" replace />;
  }

  async function onFinish(values: { email: string; password: string }) {
    setSubmitting(true);
    setError(null);
    try {
      await login(values.email, values.password);
      const tenants = await getTenants();
      navigate(tenants[0] ? `/tenants/${tenants[0].id}/rfps` : '/', {
        replace: true,
      });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <Card className="login-card">
        <Typography.Title level={2}>S2Q Interview</Typography.Title>
        <Typography.Paragraph type="secondary">
          Sign in with one of the seeded interview accounts.
        </Typography.Paragraph>
        {error && <Alert type="error" message={error} showIcon />}
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true }, { type: 'email' }]}
          >
            <Input autoComplete="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, min: 8 }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting} block>
            Sign in
          </Button>
        </Form>
      </Card>
    </div>
  );
}

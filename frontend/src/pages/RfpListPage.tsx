import { Alert, Empty, Spin, Table, Tag, Typography } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { getRfps } from '../api/rfps';
import { useAsync } from '../hooks/useAsync';
import { Rfp } from '../types';

export function RfpListPage() {
  const { tenantId } = useParams();
  const rfps = useAsync(() => (tenantId ? getRfps(tenantId) : Promise.resolve([])), [
    tenantId,
  ]);

  if (!tenantId) {
    return (
      <div className="page">
        <Spin />
      </div>
    );
  }

  return (
    <div className="page">
      <Typography.Title level={2}>RFPs</Typography.Title>
      {rfps.error && <Alert type="error" message={rfps.error} showIcon />}
      <Table<Rfp>
        rowKey="id"
        loading={rfps.loading}
        dataSource={rfps.data ?? []}
        locale={{ emptyText: <Empty description="No RFPs found" /> }}
        columns={[
          {
            title: 'Title',
            dataIndex: 'title',
            render: (title, rfp) => (
              <Link to={`/tenants/${tenantId}/rfps/${rfp.id}`}>{title}</Link>
            ),
          },
          { title: 'Customer', dataIndex: 'customerName' },
          {
            title: 'Status',
            dataIndex: 'status',
            render: (status: Rfp['status']) => <Tag>{status}</Tag>,
          },
          { title: 'Due date', dataIndex: 'dueDate' },
        ]}
      />
    </div>
  );
}

import { Alert, Button, Descriptions, Empty, Select, Space, Table, Tag, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getApiErrorMessage } from '../api/client';
import { getRfp, getRfpLanes, updateRfpStatus } from '../api/rfps';
import { getTenants } from '../api/tenants';
import { useAsync } from '../hooks/useAsync';
import { Rfp, RfpLane } from '../types';

export function RfpDetailPage() {
  const { tenantId, rfpId } = useParams();
  const [savingStatus, setSavingStatus] = useState(false);
  const rfp = useAsync(() => getRfp(tenantId!, rfpId!), [tenantId, rfpId]);
  const lanes = useAsync(() => getRfpLanes(tenantId!, rfpId!), [tenantId, rfpId]);
  const tenants = useAsync(getTenants, []);
  const [messageApi, contextHolder] = message.useMessage();

  const currentTenant = useMemo(
    () => tenants.data?.find((tenant) => tenant.id === tenantId),
    [tenantId, tenants.data],
  );
  const isAdmin = currentTenant?.role === 'admin';

  async function onStatusChange(status: Rfp['status']) {
    if (!tenantId || !rfpId) {
      return;
    }

    setSavingStatus(true);
    try {
      await updateRfpStatus(tenantId, rfpId, status);
      await rfp.reload();
      messageApi.success('RFP status updated');
    } catch (err) {
      messageApi.error(getApiErrorMessage(err));
    } finally {
      setSavingStatus(false);
    }
  }

  return (
    <div className="page">
      {contextHolder}
      <Space direction="vertical" size="large" className="full-width">
        {rfp.error && <Alert type="error" message={rfp.error} showIcon />}
        {rfp.data && (
          <>
            <div className="page-title-row">
              <Typography.Title level={2}>{rfp.data.title}</Typography.Title>
              {isAdmin && (
                <Space>
                  <Select<Rfp['status']>
                    value={rfp.data.status}
                    loading={savingStatus}
                    style={{ width: 160 }}
                    onChange={onStatusChange}
                    options={[
                      { value: 'draft', label: 'Draft' },
                      { value: 'active', label: 'Active' },
                      { value: 'closed', label: 'Closed' },
                    ]}
                  />
                  <Button loading={savingStatus}>Admin status action</Button>
                </Space>
              )}
            </div>
            <Descriptions bordered size="small">
              <Descriptions.Item label="Customer">
                {rfp.data.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag>{rfp.data.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Due date">{rfp.data.dueDate}</Descriptions.Item>
            </Descriptions>
          </>
        )}
        {lanes.error && <Alert type="error" message={lanes.error} showIcon />}
        <Table<RfpLane>
          rowKey="id"
          loading={lanes.loading}
          dataSource={lanes.data ?? []}
          locale={{ emptyText: <Empty description="No lanes found" /> }}
          columns={[
            {
              title: 'Origin',
              render: (_, lane) => `${lane.originCity}, ${lane.originState}`,
            },
            {
              title: 'Destination',
              render: (_, lane) => `${lane.destinationCity}, ${lane.destinationState}`,
            },
            { title: 'Equipment', dataIndex: 'equipmentType' },
            { title: 'Volume', dataIndex: 'estimatedVolume' },
            {
              title: 'Status',
              dataIndex: 'status',
              render: (status: RfpLane['status']) => <Tag>{status}</Tag>,
            },
            {
              title: 'Action',
              render: (_, lane) => (
                <Link to={`/tenants/${tenantId}/rfp-lanes/${lane.id}`}>Open lane</Link>
              ),
            },
          ]}
        />
      </Space>
    </div>
  );
}

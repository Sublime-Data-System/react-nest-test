import { Alert, Card, Descriptions, Result, Space, Tag, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { getRfpLane } from '../api/rfps';
import { useAsync } from '../hooks/useAsync';

export function LaneDetailPage() {
  const { tenantId, laneId } = useParams();
  const lane = useAsync(() => getRfpLane(tenantId!, laneId!), [tenantId, laneId]);

  return (
    <div className="page">
      <Space direction="vertical" size="large" className="full-width">
        <Typography.Title level={2}>RFP Lane</Typography.Title>
        {lane.error && <Alert type="error" message={lane.error} showIcon />}
        {lane.data && (
          <Card>
            <Descriptions bordered size="small">
              <Descriptions.Item label="RFP">{lane.data.rfp?.title}</Descriptions.Item>
              <Descriptions.Item label="Origin">
                {lane.data.originCity}, {lane.data.originState}
              </Descriptions.Item>
              <Descriptions.Item label="Destination">
                {lane.data.destinationCity}, {lane.data.destinationState}
              </Descriptions.Item>
              <Descriptions.Item label="Equipment">
                {lane.data.equipmentType}
              </Descriptions.Item>
              <Descriptions.Item label="Estimated volume">
                {lane.data.estimatedVolume}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag>{lane.data.status}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
        <Result
          status="info"
          title="RFP Lane Notes are the candidate assignment"
          subTitle="The base application intentionally stops here. Candidates must add the notes table, APIs, role-guarded delete behavior, and Ant Design UI."
        />
      </Space>
    </div>
  );
}

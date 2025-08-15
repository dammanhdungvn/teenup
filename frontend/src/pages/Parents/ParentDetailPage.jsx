import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Space, 
  App, 
  Spin,
  Descriptions,
  Row,
  Col,
  Divider,
  Tag,
  Avatar
} from 'antd';
import { 
  TeamOutlined, 
  EditOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { parentsApi } from '../../services/parents.api.js';
import { formatDate } from '../../utils/validation.js';

const { Title, Text } = Typography;

const ParentDetailPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [parent, setParent] = useState(null);

  const fetchParent = async () => {
    try {
      setLoading(true);
      const resp = await parentsApi.getParentById(id);
      setParent(resp.data);
    } catch (err) {
      message.error('Không thể tải thông tin phụ huynh');
      console.error('Error fetching parent:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchParent();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ 
        background: '#f8fafc', 
        minHeight: '100vh', 
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', color: '#6b7280' }}>
            Đang tải thông tin phụ huynh...
          </div>
        </div>
      </div>
    );
  }

  if (!parent) {
    return (
      <div style={{ 
        background: '#f8fafc', 
        minHeight: '100vh', 
        padding: '24px' 
      }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <TeamOutlined style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '16px' }} />
            <div style={{ color: '#6b7280', marginBottom: '16px' }}>
              Không tìm thấy phụ huynh
            </div>
            <Button onClick={() => navigate('/parents')}>
              Quay lại danh sách
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      background: '#f8fafc', 
      minHeight: '100vh', 
      padding: '24px',
      backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)'
    }}>
      <div style={{ width: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <Card style={{ 
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div>
                <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
                  <TeamOutlined style={{ marginRight: '12px', color: '#52c41a', fontSize: '28px' }} />
                  Chi tiết Phụ huynh
                </Title>
                <div style={{ color: '#6b7280', marginTop: '4px' }}>
                  Thông tin chi tiết phụ huynh ID: {parent.id}
                </div>
              </div>
              <Space size="middle">
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate('/parents')}
                  size="large"
                  style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: '8px',
                    height: '40px',
                    padding: '0 20px'
                  }}
                >
                  Quay lại
                </Button>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/parents/${id}/edit`)}
                  size="large"
                  style={{
                    background: '#1890ff',
                    border: 'none',
                    borderRadius: '8px',
                    height: '40px',
                    padding: '0 20px'
                  }}
                >
                  Chỉnh sửa
                </Button>
              </Space>
            </div>
          </Card>

          {/* Parent Information */}
          <Card style={{ 
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <Row gutter={[24, 24]}>
              {/* Avatar and Basic Info */}
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center' }}>
                  <Avatar 
                    size={120} 
                    icon={<UserOutlined />}
                    style={{ 
                      backgroundColor: '#1890ff',
                      color: 'white',
                      marginBottom: '16px'
                    }}
                  />
                  <Title level={3} style={{ margin: '16px 0 8px 0', color: '#1f2937' }}>
                    {parent.name}
                  </Title>
                  <Tag color="green" size="large" style={{ fontSize: '14px' }}>
                    Phụ huynh
                  </Tag>
                </div>
              </Col>

              {/* Detailed Information */}
              <Col xs={24} md={16}>
                <Descriptions
                  title={
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '16px'
                    }}>
                      <UserOutlined style={{ color: '#1890ff' }} />
                      <span>Thông tin cá nhân</span>
                    </div>
                  }
                  column={1}
                  bordered
                  size="middle"
                >
                  <Descriptions.Item label="ID">
                    <Tag color="blue" style={{ fontWeight: 600 }}>
                      {parent.id}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Họ và tên">
                    <Text strong style={{ fontSize: '16px' }}>
                      {parent.name}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    <Space>
                      <PhoneOutlined style={{ color: '#52c41a' }} />
                      <Text copyable style={{ fontFamily: 'monospace', fontSize: '16px' }}>
                        {parent.phone}
                      </Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <Space>
                      <MailOutlined style={{ color: '#1890ff' }} />
                      <Text copyable style={{ fontFamily: 'monospace', fontSize: '16px' }}>
                        {parent.email}
                      </Text>
                    </Space>
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Descriptions
                  title={
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '16px'
                    }}>
                      <CalendarOutlined style={{ color: '#722ed1' }} />
                      <span>Thông tin hệ thống</span>
                    </div>
                  }
                  column={1}
                  bordered
                  size="middle"
                >
                  <Descriptions.Item label="Ngày tạo">
                    <Text>{formatDate(parent.createdAt)}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Cập nhật lần cuối">
                    <Text>
                      {parent.updatedAt ? formatDate(parent.updatedAt) : 'Chưa cập nhật'}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>

          {/* Future: Students List */}
          <Card style={{ 
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <TeamOutlined style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '16px' }} />
              <div style={{ color: '#6b7280', marginBottom: '16px' }}>
                Danh sách học sinh của phụ huynh này
              </div>
              <Text type="secondary">
                Tính năng này sẽ được implement trong Task 5 (Student Classes)
              </Text>
            </div>
          </Card>
        </Space>
      </div>
    </div>
  );
};

export default ParentDetailPage;

import React from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Space,
  Button 
} from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  BookOutlined, 
  GiftOutlined,
  PlusOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Thêm học sinh',
      description: 'Tạo hồ sơ học sinh mới',
      icon: <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      action: () => navigate('/students/new'),
      color: '#1890ff',
    },
    {
      title: 'Thêm phụ huynh',
      description: 'Tạo hồ sơ phụ huynh mới',
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      action: () => navigate('/parents/new'),
      color: '#52c41a',
    },
    {
      title: 'Tạo lớp học',
      description: 'Thiết lập lớp học mới',
      icon: <BookOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />,
      action: () => navigate('/classes/new'),
      color: '#fa8c16',
    },
    {
      title: 'Tạo gói học',
      description: 'Thiết lập gói học mới',
      icon: <GiftOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      action: () => navigate('/subscriptions/new'),
      color: '#722ed1',
    },
  ];

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Welcome Section */}
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Title level={1} style={{ color: '#1890ff', marginBottom: '16px' }}>
            🎓 Chào mừng đến với TeenUp Contest
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Hệ thống quản lý học sinh, lớp học và gói học chuyên nghiệp
          </Paragraph>
        </div>

        {/* Quick Stats */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng học sinh"
                value={0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng phụ huynh"
                value={0}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng lớp học"
                value={0}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Gói học đang hoạt động"
                value={0}
                prefix={<GiftOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <div>
          <Title level={3} style={{ marginBottom: '24px' }}>
            Thao tác nhanh
          </Title>
          <Row gutter={[24, 24]}>
            {quickActions.map((action, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card
                  hoverable
                  onClick={action.action}
                  style={{ 
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: `2px solid ${action.color}`,
                    transition: 'all 0.3s ease'
                  }}
                  styles={{ body: { padding: '24px 16px' } }}
                >
                  <div style={{ marginBottom: '16px' }}>
                    {action.icon}
                  </div>
                  <Title level={4} style={{ margin: '8px 0', color: action.color }}>
                    {action.title}
                  </Title>
                  <Paragraph style={{ color: '#666', margin: 0 }}>
                    {action.description}
                  </Paragraph>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ 
                      marginTop: '16px',
                      backgroundColor: action.color,
                      borderColor: action.color
                    }}
                  >
                    Thực hiện
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Navigation Cards */}
        <div>
          <Title level={3} style={{ marginBottom: '24px' }}>
            Quản lý hệ thống
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={8}>
                             <Card
                 hoverable
                 onClick={() => navigate('/students/list')}
                 style={{ cursor: 'pointer' }}
               >
                <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
                  <UserOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                  <Title level={4} style={{ margin: 0 }}>Quản lý học sinh</Title>
                  <Paragraph style={{ color: '#666', margin: 0 }}>
                    Xem danh sách, thêm mới và quản lý thông tin học sinh
                  </Paragraph>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card
                hoverable
                onClick={() => navigate('/classes')}
                style={{ cursor: 'pointer' }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
                  <BookOutlined style={{ fontSize: '48px', color: '#fa8c16' }} />
                  <Title level={4} style={{ margin: 0 }}>Quản lý lớp học</Title>
                  <Paragraph style={{ color: '#666', margin: 0 }}>
                    Xem lịch học, quản lý lớp và đăng ký học sinh
                  </Paragraph>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card
                hoverable
                onClick={() => navigate('/subscriptions')}
                style={{ cursor: 'pointer' }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
                  <GiftOutlined style={{ fontSize: '48px', color: '#722ed1' }} />
                  <Title level={4} style={{ margin: 0 }}>Quản lý gói học</Title>
                  <Paragraph style={{ color: '#666', margin: 0 }}>
                    Theo dõi và quản lý các gói học của học sinh
                  </Paragraph>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </Space>
    </div>
  );
};

export default HomePage;

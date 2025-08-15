import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Space,
  Button,
  Spin,
  App
} from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  BookOutlined, 
  GiftOutlined,
  PlusOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../services/dashboard.api.js';
import { handleError } from '../../utils/errorHandler.js';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  
  // State cho dashboard stats
  const [stats, setStats] = useState({
    studentsCount: 0,
    parentsCount: 0,
    classesCount: 0,
    activeSubscriptionsCount: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch từng API riêng biệt để đảm bảo hoạt động
      const [studentsResp, parentsResp, classesResp, subscriptionsResp] = await Promise.allSettled([
        dashboardApi.getStudentsList(),
        dashboardApi.getParentsList(),
        dashboardApi.getClassesList(),
        dashboardApi.getSubscriptionsList()
      ]);

      // Cập nhật stats với dữ liệu thực từ API (đếm length của array)
      setStats({
        studentsCount: studentsResp.status === 'fulfilled' ? (studentsResp.value.data?.length || 0) : 0,
        parentsCount: parentsResp.status === 'fulfilled' ? (parentsResp.value.data?.length || 0) : 0,
        classesCount: classesResp.status === 'fulfilled' ? (classesResp.value.data?.length || 0) : 0,
        activeSubscriptionsCount: subscriptionsResp.status === 'fulfilled' ? (subscriptionsResp.value.data?.length || 0) : 0
      });

    } catch (err) {
      handleError(err, message, 'Không thể tải dữ liệu dashboard', 'fetchDashboardData');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data khi component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

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
        <div style={{ position: 'relative' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px' 
          }}>
            <Title level={3} style={{ margin: 0 }}>Thống kê tổng quan</Title>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchDashboardData}
              loading={loading}
              type="primary"
              size="small"
            >
              Làm mới
            </Button>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px', color: '#6b7280' }}>
                Đang tải dữ liệu dashboard...
              </div>
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card hoverable>
                  <Statistic
                    title="Tổng học sinh"
                    value={stats.studentsCount}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card hoverable>
                  <Statistic
                    title="Tổng phụ huynh"
                    value={stats.parentsCount}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card hoverable>
                  <Statistic
                    title="Tổng lớp học"
                    value={stats.classesCount}
                    prefix={<BookOutlined />}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card hoverable>
                  <Statistic
                    title="Gói học đang hoạt động"
                    value={stats.activeSubscriptionsCount}
                    prefix={<GiftOutlined />}
                    valueStyle={{ color: '#722ed1' }}

                  />
                </Card>
              </Col>
            </Row>
          )}
        </div>

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

import React, { useEffect, useState, useCallback } from 'react';
import './HomePage.css';
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
    activeSubscriptionsCount: 0,
    totalSessions: 0,
    usedSessions: 0,
    upcomingClasses: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch từng API riêng biệt để đảm bảo hoạt động
      const [studentsResp, parentsResp, classesResp, subscriptionsResp] = await Promise.allSettled([
        dashboardApi.getStudentsList(),
        dashboardApi.getParentsList(),
        dashboardApi.getClassesList(),
        dashboardApi.getSubscriptionsList()
      ]);

      // Tính toán thống kê chi tiết
      const students = studentsResp.status === 'fulfilled' ? (studentsResp.value.data || []) : [];
      const parents = parentsResp.status === 'fulfilled' ? (parentsResp.value.data || []) : [];
      const classes = classesResp.status === 'fulfilled' ? (classesResp.value.data || []) : [];
      const subscriptions = subscriptionsResp.status === 'fulfilled' ? (subscriptionsResp.value.data || []) : [];

      // Tính tổng số buổi học và số buổi đã sử dụng
      const totalSessions = subscriptions.reduce((sum, sub) => sum + (sub.totalSessions || 0), 0);
      const usedSessions = subscriptions.reduce((sum, sub) => sum + (sub.usedSessions || 0), 0);

      // Tính số lớp học sắp tới (trong tuần này)
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcomingClasses = classes.filter(cls => {
        const classDate = new Date(cls.startDate || cls.createdAt);
        return classDate >= today && classDate <= nextWeek;
      }).length;

      setStats({
        studentsCount: students.length,
        parentsCount: parents.length,
        classesCount: classes.length,
        activeSubscriptionsCount: subscriptions.length,
        totalSessions,
        usedSessions,
        upcomingClasses
      });

    } catch (err) {
      handleError(err, message, 'Không thể tải dữ liệu dashboard', 'fetchDashboardData');
    } finally {
      setLoading(false);
    }
  }, [message]);

  // Fetch data khi component mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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
            <>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <Card 
                    hoverable 
                    className="stats-card"
                    style={{ 
                      background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                      border: '1px solid #bbdefb'
                    }}
                  >
                    <Statistic
                      title="Tổng học sinh"
                      value={stats.studentsCount}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: '#1890ff', fontSize: '28px' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card 
                    hoverable 
                    className="stats-card"
                    style={{ 
                      background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)',
                      border: '1px solid #c8e6c9'
                    }}
                  >
                    <Statistic
                      title="Tổng phụ huynh"
                      value={stats.parentsCount}
                      prefix={<TeamOutlined />}
                      valueStyle={{ color: '#52c41a', fontSize: '28px' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card 
                    hoverable 
                    className="stats-card"
                    style={{ 
                      background: 'linear-gradient(135deg, #fff3e0 0%, #fef7e0 100%)',
                      border: '1px solid #ffcc80'
                    }}
                  >
                    <Statistic
                      title="Tổng lớp học"
                      value={stats.classesCount}
                      prefix={<BookOutlined />}
                      valueStyle={{ color: '#fa8c16', fontSize: '28px' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card 
                    hoverable 
                    className="stats-card"
                    style={{ 
                      background: 'linear-gradient(135deg, #f3e5f5 0%, #f8f0f8 100%)',
                      border: '1px solid #e1bee7'
                    }}
                  >
                    <Statistic
                      title="Gói học đang hoạt động"
                      value={stats.activeSubscriptionsCount}
                      prefix={<GiftOutlined />}
                      valueStyle={{ color: '#722ed1', fontSize: '28px' }}
                    />
                  </Card>
                </Col>
              </Row>
              
              <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
              <Col xs={24} sm={12} lg={8}>
                <Card 
                  hoverable 
                  style={{ 
                    background: 'linear-gradient(135deg, #e0f2f1 0%, #f0f8f8 100%)',
                    border: '1px solid #b2dfdb'
                  }}
                >
                  <Statistic
                    title="Tổng số buổi học"
                    value={stats.totalSessions}
                    valueStyle={{ color: '#009688', fontSize: '24px' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card 
                  hoverable 
                  style={{ 
                    background: 'linear-gradient(135deg, #fff8e1 0%, #fef9e7 100%)',
                    border: '1px solid #ffecb3'
                  }}
                >
                  <Statistic
                    title="Số buổi đã sử dụng"
                    value={stats.usedSessions}
                    valueStyle={{ color: '#ff9800', fontSize: '24px' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card 
                  hoverable 
                  style={{ 
                    background: 'linear-gradient(135deg, #fce4ec 0%, #fef0f3 100%)',
                    border: '1px solid #f8bbd9'
                  }}
                >
                  <Statistic
                    title="Lớp học sắp tới (tuần này)"
                    value={stats.upcomingClasses}
                    valueStyle={{ color: '#e91e63', fontSize: '24px' }}
                  />
                </Card>
              </Col>
            </Row>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <Title level={3} style={{ marginBottom: '24px' }}>
            Thao tác nhanh
          </Title>
          <Row gutter={[16, 16]}>
            {quickActions.map((action, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  hoverable
                  className="dashboard-card"
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
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                className="dashboard-card"
                onClick={() => navigate('/students/list')}
                style={{ 
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                  border: '1px solid #bbdefb'
                }}
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
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                className="dashboard-card"
                onClick={() => navigate('/classes')}
                style={{ 
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #fff3e0 0%, #fef7e0 100%)',
                  border: '1px solid #ffcc80'
                }}
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
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                className="dashboard-card"
                onClick={() => navigate('/subscriptions')}
                style={{ 
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #f3e5f5 0%, #f8f0f8 100%)',
                  border: '1px solid #e1bee7'
                }}
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

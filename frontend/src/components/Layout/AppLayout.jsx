import React from 'react';
import { Layout, Menu, Typography, Space } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  BookOutlined, 
  GiftOutlined,
  HomeOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title } = Typography;

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
    },
    {
      key: '/students',
      icon: <UserOutlined />,
      label: 'Học sinh',
      children: [
        {
          key: '/students/list',
          label: 'Danh sách học sinh',
        },
        {
          key: '/students/new',
          label: 'Thêm học sinh',
        },
      ],
    },
    {
      key: '/parents',
      icon: <TeamOutlined />,
      label: 'Phụ huynh',
    },
    {
      key: '/classes',
      icon: <BookOutlined />,
      label: 'Lớp học',
    },
    {
      key: '/subscriptions',
      icon: <GiftOutlined />,
      label: 'Gói học',
      children: [
        {
          key: '/subscriptions/list',
          label: 'Danh sách gói học',
        },
        {
          key: '/subscriptions/new',
          label: 'Tạo gói học',
        },
      ],
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Space>
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            🎓 TeenUp Contest
          </Title>
        </Space>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ 
            background: 'transparent',
            border: 'none',
            flex: 1,
            justifyContent: 'center'
          }}
        />
      </Header>
      
      <Content style={{ 
        padding: '24px',
        background: '#f5f5f5',
        minHeight: 'calc(100vh - 64px)'
      }}>
        <div style={{ 
          background: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          minHeight: 'calc(100vh - 140px)'
        }}>
          {children}
        </div>
      </Content>
    </Layout>
  );
};

export default AppLayout;

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Typography, 
  Card, 
  Tag, 
  Spin,
  Tooltip,
  App,
  Select
} from 'antd';
import { 
  UserOutlined, 
  PlusOutlined, 
  EyeOutlined,
  EditOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { studentsApi } from '../../services/students.api.js';
import { GENDER_OPTIONS, GRADE_OPTIONS } from '../../utils/validation.js';

const { Title } = Typography;

const StudentsListPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { message } = App.useApp();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsApi.getStudentsList();
      setStudents(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách học sinh');
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGenderLabel = (gender) => {
    const genderOption = GENDER_OPTIONS.find(option => option.value === gender);
    return genderOption ? genderOption.label : gender;
  };

  const getGradeLabel = (grade) => {
    const gradeOption = GRADE_OPTIONS.find(option => option.value === grade);
    return gradeOption ? gradeOption.label : grade;
  };

  const getGenderColor = (gender) => {
    switch (gender) {
      case 'M': return 'blue';
      case 'F': return 'pink';
      case 'O': return 'purple';
      default: return 'default';
    }
  };

    const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: (id) => (
        <Tag 
          color="blue" 
          style={{ 
            fontWeight: 600, 
            fontSize: '14px',
            padding: '8px 12px',
            borderRadius: '8px',
            minWidth: '60px'
          }}
        >
          {id}
        </Tag>
      ),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (name) => (
        <Space size="middle">
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#1890ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            boxShadow: '0 2px 8px rgba(24, 144, 255, 0.2)'
          }}>
            <UserOutlined />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#1f2937', fontSize: '16px' }}>{name}</div>
            <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '2px' }}>Học sinh</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Lớp hiện tại',
      dataIndex: 'currentGrade',
      key: 'currentGrade',
      width: 200,
      align: 'center',
      render: (grade) => (
        <Tag 
          color="green" 
          style={{ 
            fontWeight: 600,
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            minWidth: '80px'
          }}
        >
          {getGradeLabel(grade)}
        </Tag>
      ),
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      width: 150,
      align: 'center',
      render: (gender) => (
        <Tag 
          color={getGenderColor(gender)}
          style={{ 
            fontWeight: 600,
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            minWidth: '80px'
          }}
        >
          {getGenderLabel(gender)}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 250,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/students/${record.id}`)}
              size="middle"
              style={{
                background: '#1890ff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.2)'
              }}
            >
              Xem
            </Button>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => navigate(`/students/${record.id}/edit`)}
              size="middle"
              style={{
                border: '2px solid #52c41a',
                color: '#52c41a',
                borderRadius: '8px',
                padding: '8px 16px',
                fontWeight: 600,
                background: 'transparent'
              }}
            >
              Sửa
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleAddNew = () => {
    navigate('/students/new');
  };

  const handleBackToList = () => {
    navigate('/students/list');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải danh sách học sinh...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: '#f8fafc', 
      minHeight: '100vh', 
      padding: '32px 24px',
      backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <Card style={{ 
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
                  <UserOutlined style={{ marginRight: '12px', color: '#1890ff', fontSize: '28px' }} />
                  Danh sách học sinh
                </Title>
                <div style={{ color: '#6b7280', marginTop: '4px' }}>
                  Quản lý thông tin học sinh trong hệ thống
                </div>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={handleAddNew}
                style={{
                  background: '#1890ff',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(24, 144, 255, 0.2)',
                  fontWeight: 600,
                  borderRadius: '8px'
                }}
              >
                Thêm học sinh mới
              </Button>
            </div>
          </Card>

          {/* Table */}
          <Card style={{ 
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            padding: '0'
          }}>
            <Table
              columns={columns}
              dataSource={students}
              rowKey="id"
              pagination={false}
              loading={loading}
              locale={{
                emptyText: (
                  <div style={{ textAlign: 'center', padding: '60px' }}>
                    <UserOutlined style={{ fontSize: '64px', color: '#d1d5db', marginBottom: '24px' }} />
                    <div style={{ color: '#6b7280', fontSize: '16px' }}>Chưa có học sinh nào</div>
                  </div>
                ),
              }}
              style={{
                borderRadius: '12px',
                overflow: 'hidden'
              }}
              size="large"
              scroll={{ x: 1000 }}
            />
          </Card>

          {/* Pagination - Tách riêng ở cuối */}
          <Card style={{ 
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            marginTop: '24px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '16px 24px'
            }}>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>
                Tổng cộng {students.length} học sinh
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>Hiển thị</span>
                <Select
                  defaultValue={10}
                  style={{ width: 80 }}
                  options={[
                    { value: 10, label: '10' },
                    { value: 20, label: '20' },
                    { value: 50, label: '50' }
                  ]}
                />
                <span style={{ color: '#6b7280', fontSize: '14px' }}>học sinh/trang</span>
              </div>
            </div>
          </Card>
        </Space>
      </div>
    </div>
  );
};

export default StudentsListPage;

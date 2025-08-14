import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Space, 
  Button, 
  Tag, 
  Spin, 
  Row, 
  Col, 
  Divider,
  Descriptions,
  App
} from 'antd';
import { 
  UserOutlined, 
  ArrowLeftOutlined, 
  EditOutlined,
  CalendarOutlined,
  TeamOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { studentsApi } from '../../services/students.api.js';
import { GENDER_OPTIONS, GRADE_OPTIONS, formatDate } from '../../utils/validation.js';

const { Title, Text } = Typography;

const StudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentDetail();
  }, [id]);

  const fetchStudentDetail = async () => {
    try {
      setLoading(true);
      const response = await studentsApi.getStudentById(id);
      setStudent(response.data);
    } catch (error) {
      message.error('Không thể tải thông tin học sinh');
      console.error('Error fetching student:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGenderLabel = (gender) => {
    const genderOption = GENDER_OPTIONS.find(option => option.value === gender);
    return genderOption ? genderOption.label : gender;
  };

  const getGenderColor = (gender) => {
    switch (gender) {
      case 'M': return 'blue';
      case 'F': return 'pink';
      case 'O': return 'purple';
      default: return 'default';
    }
  };

  const getGradeLabel = (grade) => {
    const gradeOption = GRADE_OPTIONS.find(option => option.value === grade);
    return gradeOption ? gradeOption.label : grade;
  };

  const handleBack = () => {
    navigate('/students/list');
  };

  const handleEdit = () => {
    navigate(`/students/${id}/edit`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải thông tin học sinh...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ color: '#ff4d4f', fontSize: '18px' }}>Không tìm thấy học sinh</div>
        <Button onClick={handleBack} style={{ marginTop: '16px' }}>
          Quay lại danh sách
        </Button>
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
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <Card style={{ 
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  onClick={handleBack}
                  type="text"
                  size="large"
                />
                <div>
                  <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
                    <UserOutlined style={{ marginRight: '12px', color: '#1890ff', fontSize: '28px' }} />
                    Chi tiết học sinh
                  </Title>
                  <Text style={{ color: '#6b7280' }}>
                    Thông tin chi tiết của học sinh
                  </Text>
                </div>
              </div>
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="large"
                onClick={handleEdit}
                style={{
                  background: '#52c41a',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(82, 196, 26, 0.2)',
                  fontWeight: 600,
                  borderRadius: '8px'
                }}
              >
                Chỉnh sửa
              </Button>
            </div>
          </Card>

          {/* Student Info */}
          <Card style={{ 
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: '#1890ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '48px',
                boxShadow: '0 4px 16px rgba(24, 144, 255, 0.3)'
              }}>
                <UserOutlined />
              </div>
              <div>
                <Title level={1} style={{ margin: 0, color: '#1f2937' }}>
                  {student.name}
                </Title>
                <div style={{ marginTop: '8px' }}>
                  <Tag 
                    color={getGenderColor(student.gender)}
                    style={{ 
                      fontSize: '16px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: 600
                    }}
                  >
                    {getGenderLabel(student.gender)}
                  </Tag>
                  <Tag 
                    color="green"
                    style={{ 
                      fontSize: '16px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      marginLeft: '12px'
                    }}
                  >
                    {getGradeLabel(student.currentGrade)}
                  </Tag>
                </div>
              </div>
            </div>

            <Divider />

            <Row gutter={[32, 24]}>
              <Col xs={24} md={12}>
                <Card 
                  size="small" 
                  title={
                    <Space>
                      <CalendarOutlined style={{ color: '#1890ff' }} />
                      <span>Thông tin cá nhân</span>
                    </Space>
                  }
                  style={{ border: '1px solid #e5e7eb' }}
                >
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Họ và tên">
                      <Text strong>{student.name}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày sinh">
                      <Text>{formatDate(student.dob)}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Giới tính">
                      <Tag color={getGenderColor(student.gender)}>
                        {getGenderLabel(student.gender)}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Lớp hiện tại">
                      <Tag color="green">{getGradeLabel(student.currentGrade)}</Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card 
                  size="small" 
                  title={
                    <Space>
                      <TeamOutlined style={{ color: '#52c41a' }} />
                      <span>Thông tin phụ huynh</span>
                    </Space>
                  }
                  style={{ border: '1px solid #e5e7eb' }}
                >
                  {student.parent && (
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Tên phụ huynh">
                        <Text strong>{student.parent.name}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Số điện thoại">
                        <Text>{student.parent.phone}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Email">
                        <Text>{student.parent.email}</Text>
                      </Descriptions.Item>
                    </Descriptions>
                  )}
                </Card>
              </Col>
            </Row>

            <Divider />

            <Row>
              <Col span={24}>
                <Card 
                  size="small" 
                  title={
                    <Space>
                      <BookOutlined style={{ color: '#fa8c16' }} />
                      <span>Thông tin hệ thống</span>
                    </Space>
                  }
                  style={{ border: '1px solid #e5e7eb' }}
                >
                  <Descriptions column={2} size="small">
                    <Descriptions.Item label="ID học sinh">
                      <Text strong>#{student.id}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                      <Text>{formatDate(student.createdAt)}</Text>
                    </Descriptions.Item>
                    {student.updatedAt && (
                      <Descriptions.Item label="Ngày cập nhật">
                        <Text>{formatDate(student.updatedAt)}</Text>
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          </Card>
        </Space>
      </div>
    </div>
  );
};

export default StudentDetailPage;

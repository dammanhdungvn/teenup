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
  Avatar,
  Modal
} from 'antd';
import { 
  TeamOutlined, 
  EditOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { parentsApi } from '../../services/parents.api.js';
import { studentsApi } from '../../services/students.api.js';
import { formatDate, DAY_OF_WEEK_MAP } from '../../utils/validation.js';
import { handleError } from '../../utils/errorHandler.js';

const { Title, Text } = Typography;

const ParentDetailPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [parent, setParent] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [unassignModalVisible, setUnassignModalVisible] = useState(false);
  const [studentToUnassign, setStudentToUnassign] = useState(null);

  const fetchParent = async () => {
    try {
      setLoading(true);
      const resp = await parentsApi.getParentById(id);
      setParent(resp.data);
    } catch (err) {
      handleError(err, message, 'Không thể tải thông tin phụ huynh', 'fetchParent');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setStudentsLoading(true);
      // Sử dụng API endpoint riêng để lấy students của parent này
      const resp = await parentsApi.getParentStudents(id);
      

      
      setStudents(resp.data);
    } catch (err) {
      handleError(err, message, 'Không thể tải danh sách học sinh', 'fetchStudents');
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleUnassignStudent = (student) => {
    setStudentToUnassign(student);
    setUnassignModalVisible(true);
  };

  const confirmUnassignStudent = async () => {
    if (!studentToUnassign) return;
    
    try {
      // Sử dụng endpoint mới để unassign student
      await parentsApi.unassignStudent(id, studentToUnassign.id);
      message.success('Đã gỡ bỏ học sinh khỏi phụ huynh!');
      setUnassignModalVisible(false);
      setStudentToUnassign(null);
      
      // Refresh danh sách học sinh
      fetchStudents();
    } catch (err) {
      handleError(err, message, 'Không thể gỡ bỏ học sinh khỏi phụ huynh', 'confirmUnassignStudent');
    }
  };

  const cancelUnassignStudent = () => {
    setUnassignModalVisible(false);
    setStudentToUnassign(null);
  };

  useEffect(() => {
    if (id) {
      fetchParent();
      fetchStudents();
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

          {/* Students List */}
          <Card style={{ 
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TeamOutlined style={{ color: '#722ed1' }} />
                <span style={{ fontWeight: 600, fontSize: '16px' }}>
                  Danh sách học sinh
                </span>
                <Tag color="blue">{students.length} học sinh</Tag>
              </div>
            </div>
            


            {studentsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px', color: '#6b7280' }}>
                  Đang tải danh sách học sinh...
                </div>
              </div>
            ) : students.length > 0 ? (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {students.map((student, index) => (
                  <Card
                    key={student.id}
                    size="small"
                    hoverable
                    style={{ 
                      marginBottom: '8px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}>
                      <Space>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          background: '#1890ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '14px'
                        }}>
                          {index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: '#1f2937' }}>
                            {student.name}
                          </div>
                          <div style={{ color: '#6b7280', fontSize: '12px' }}>
                            {student.currentGrade} • {student.gender === 'M' ? 'Nam' : 'Nữ'}
                          </div>
                        </div>
                      </Space>
                      <Space>
                        <Button
                          size="small"
                          icon={<UserOutlined />}
                          onClick={() => navigate(`/students/${student.id}`)}
                          style={{
                            border: '1px solid #1890ff',
                            borderRadius: '6px',
                            fontSize: '11px',
                            padding: '2px 6px',
                            height: '24px'
                          }}
                        >
                          Xem
                        </Button>
                        <Button
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => handleUnassignStudent(student)}
                          style={{
                            borderRadius: '6px',
                            fontSize: '11px',
                            padding: '2px 6px',
                            height: '24px'
                          }}
                        >
                          Gỡ bỏ
                        </Button>
                      </Space>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: '#6b7280'
              }}>
                <TeamOutlined style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                <div style={{ marginBottom: '16px' }}>
                  Chưa có học sinh nào được gán cho phụ huynh này
                </div>
              </div>
            )}
          </Card>
        </Space>

        {/* Unassign Student Confirmation Modal */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DeleteOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
              <span>Xác nhận gỡ bỏ học sinh khỏi phụ huynh</span>
            </div>
          }
          open={unassignModalVisible}
          onOk={confirmUnassignStudent}
          onCancel={cancelUnassignStudent}
          okText="Gỡ bỏ"
          cancelText="Hủy"
          okButtonProps={{
            danger: true,
            style: {
              background: '#ff4d4f',
              border: 'none',
              borderRadius: '8px',
              height: '40px',
              padding: '0 20px'
            }
          }}
          cancelButtonProps={{
            style: {
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              height: '40px',
              padding: '0 20px'
            }
          }}
          centered
        >
          <div style={{ padding: '16px 0' }}>
            <p style={{ marginBottom: '16px', fontSize: '16px', color: '#1f2937' }}>
              Bạn có chắc chắn muốn gỡ bỏ học sinh này khỏi phụ huynh không?
            </p>
            {studentToUnassign && (
              <div style={{ 
                background: '#f8f9fa', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>
                  Thông tin học sinh:
                </div>
                <div style={{ color: '#6b7280' }}>
                  <div><strong>ID:</strong> {studentToUnassign.id}</div>
                  <div><strong>Họ và tên:</strong> {studentToUnassign.name}</div>
                  <div><strong>Lớp hiện tại:</strong> {studentToUnassign.currentGrade}</div>
                  <div><strong>Giới tính:</strong> {studentToUnassign.gender === 'M' ? 'Nam' : 'Nữ'}</div>
                </div>
              </div>
            )}
            <div style={{ 
              marginTop: '16px', 
              padding: '12px 16px', 
              background: '#fff2e8', 
              border: '1px solid #ffd591',
              borderRadius: '6px',
              color: '#d46b08'
            }}>
              <strong>⚠️ Lưu ý:</strong> Hành động này sẽ gỡ bỏ học sinh khỏi phụ huynh hiện tại. 
              Học sinh sẽ không còn liên kết với phụ huynh này.
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ParentDetailPage;

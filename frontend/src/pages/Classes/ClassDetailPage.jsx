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
  Table,
  Tooltip,
  Modal,
  Select
} from 'antd';
import { 
  BookOutlined, 
  EditOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { classesApi } from '../../services/classes.api.js';
import { studentsApi } from '../../services/students.api.js';
import { formatDate, getDayOfWeekLabel, formatTimeSlot } from '../../utils/validation.js';

const { Title, Text } = Typography;

const ClassDetailPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [unregisterModalVisible, setUnregisterModalVisible] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchClassDetail();
      fetchClassRegistrations();
    }
  }, [id]);

  const fetchClassDetail = async () => {
    try {
      setLoading(true);
      const resp = await classesApi.getClassById(id);
      setClassData(resp.data);
    } catch (err) {
      console.error('Error fetching class:', err);
      const backendMessage = err?.response?.data?.message;
      if (backendMessage) {
        message.error(backendMessage);
      } else {
        message.error('Không thể tải thông tin lớp học');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchClassRegistrations = async () => {
    try {
      setRegistrationsLoading(true);
      const resp = await classesApi.getRegistrations(id);
      setRegistrations(resp.data || []);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      console.error('Error details:', err.response?.data);
    } finally {
      setRegistrationsLoading(false);
    }
  };

  const handleDeleteClass = async () => {
    try {
      await classesApi.deleteClass(id);
      message.success('Xóa lớp học thành công!');
      navigate('/classes');
    } catch (err) {
      console.error('Error deleting class:', err);
      const backendMessage = err?.response?.data?.message;
      if (backendMessage) {
        message.error(backendMessage);
      } else {
        message.error('Không thể xóa lớp học');
      }
    }
  };

  const handleUnregisterStudent = (registration) => {
    setSelectedRegistration(registration);
    setUnregisterModalVisible(true);
  };

  const confirmUnregisterStudent = async () => {
    if (!selectedRegistration) return;
    
    // Lấy student ID từ selectedRegistration
    const studentId = selectedRegistration.id;
    
    if (!studentId) {
      message.error('Không thể xác định ID học sinh');
      return;
    }
    
    try {
      await classesApi.unregisterStudent(id, studentId);
      message.success('Đã xóa học sinh khỏi lớp học!');
      setUnregisterModalVisible(false);
      setSelectedRegistration(null);
      
      // Refresh danh sách đăng ký
      fetchClassRegistrations();
    } catch (err) {
      console.error('Error unregistering student:', err);
      const backendMessage = err?.response?.data?.message;
      if (backendMessage) {
        message.error(backendMessage);
      } else {
        message.error('Không thể xóa học sinh khỏi lớp học');
      }
    }
  };

  const cancelUnregisterStudent = () => {
    setUnregisterModalVisible(false);
    setSelectedRegistration(null);
  };

  const showRegisterModal = async () => {
    try {
      setRegisterLoading(true);
      const resp = await studentsApi.getStudentsList();
      setStudentsList(resp.data || []);
      setRegisterModalVisible(true);
    } catch (err) {
      message.error('Không thể tải danh sách học sinh');
    } finally {
      setRegisterLoading(false);
    }
  };

  const confirmRegisterStudent = async () => {
    if (!selectedStudentId) {
      message.error('Vui lòng chọn học sinh');
      return;
    }

    try {
      setRegisterLoading(true);
      await classesApi.registerStudent(id, { studentId: selectedStudentId });
      message.success('Đã đăng ký học sinh vào lớp học!');
      setRegisterModalVisible(false);
      setSelectedStudentId(null);
      
      // Refresh danh sách đăng ký
      fetchClassRegistrations();
    } catch (err) {
      const backendMessage = err?.response?.data?.message;
      if (backendMessage) {
        message.error(backendMessage);
      } else {
        message.error('Không thể đăng ký học sinh vào lớp học');
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const cancelRegisterStudent = () => {
    setRegisterModalVisible(false);
    setSelectedStudentId(null);
  };

  const registrationColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
      fixed: 'left',
      render: (id) => (
        <Tag color="blue" style={{ fontWeight: 600 }}>
          {id}
        </Tag>
      ),
    },
    {
      title: 'Học sinh',
      key: 'student',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar 
            size={32} 
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>
              {record.name || 'N/A'}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              ID: {record.id || 'N/A'}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Lớp hiện tại',
      dataIndex: 'currentGrade',
      key: 'currentGrade',
      width: 120,
      align: 'center',
      render: (grade) => (
        <Tag color="green">
          {grade || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      align: 'center',
      render: (date) => formatDate(date),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết học sinh">
            <Button
              size="small"
              icon={<UserOutlined />}
              onClick={() => {
                const studentId = record.id;
                if (studentId) {
                  navigate(`/students/${studentId}`);
                } else {
                  message.error('Không thể xác định ID học sinh');
                }
              }}
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
          </Tooltip>
          <Tooltip title="Xóa khỏi lớp học">
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleUnregisterStudent(record)}
              style={{
                borderRadius: '6px',
                fontSize: '11px',
                padding: '2px 6px',
                height: '24px'
              }}
            >
              Xóa
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ 
        background: '#f8fafc', 
        minHeight: '100vh', 
        padding: '32px 24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', color: '#6b7280' }}>
            Đang tải thông tin lớp học...
          </div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div style={{ 
        background: '#f8fafc', 
        minHeight: '100vh', 
        padding: '32px 24px' 
      }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <BookOutlined style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '16px' }} />
            <div style={{ color: '#6b7280', marginBottom: '16px' }}>
              Không tìm thấy lớp học
            </div>
            <Button onClick={() => navigate('/classes')}>
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
      padding: '32px 24px',
      backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
                  <BookOutlined style={{ marginRight: '12px', color: '#1890ff', fontSize: '28px' }} />
                  Chi tiết Lớp học
                </Title>
                <div style={{ color: '#6b7280', marginTop: '4px' }}>
                  Thông tin chi tiết lớp học: {classData.name || classData.className}
                </div>
              </div>
              <Space>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate('/classes')}
                  style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: '8px'
                  }}
                >
                  Quay lại
                </Button>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/classes/${id}/edit`)}
                  style={{
                    background: '#52c41a',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteClass}
                  style={{
                    borderRadius: '8px'
                  }}
                >
                  Xóa
                </Button>
              </Space>
            </div>
          </Card>

          {/* Class Information */}
          <Card style={{ 
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <Row gutter={[24, 24]}>
              {/* Basic Info */}
              <Col xs={24} md={12}>
                <Descriptions
                  title={
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '16px'
                    }}>
                      <BookOutlined style={{ color: '#1890ff' }} />
                      <span>Thông tin cơ bản</span>
                    </div>
                  }
                  column={1}
                  bordered
                  size="middle"
                >
                  <Descriptions.Item label="ID">
                    <Tag color="blue" style={{ fontWeight: 600 }}>
                      {classData.id}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên lớp">
                    <Text strong style={{ fontSize: '16px' }}>
                      {classData.name || classData.className}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Giáo viên">
                    <Text strong>{classData.teacherName}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Mô tả">
                    <Text>{classData.description || 'Không có mô tả'}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Col>

              {/* Schedule Info */}
              <Col xs={24} md={12}>
                <Descriptions
                  title={
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '16px'
                    }}>
                      <CalendarOutlined style={{ color: '#52c41a' }} />
                      <span>Lịch học</span>
                    </div>
                  }
                  column={1}
                  bordered
                  size="middle"
                >
                  <Descriptions.Item label="Thứ trong tuần">
                    <Tag color="green" size="large">
                      {getDayOfWeekLabel(classData.dayOfWeek)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian">
                    <Tag color="blue" size="large">
                      {formatTimeSlot(classData.timeSlot)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số học sinh tối đa">
                    <Text strong>{classData.maxStudents || 'Không giới hạn'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số học sinh hiện tại">
                    <Text strong style={{ color: '#1890ff' }}>
                      {registrations.length}
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
                  Danh sách học sinh đã đăng ký
                </span>
                <Tag color="blue">{registrations.length} học sinh</Tag>
              </div>
              <Button
                type="primary"
                icon={<UserOutlined />}
                onClick={showRegisterModal}
                style={{
                  background: '#722ed1',
                  border: 'none',
                  borderRadius: '8px'
                }}
              >
                Thêm học sinh
              </Button>
            </div>

            {registrationsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px', color: '#6b7280' }}>
                  Đang tải danh sách học sinh...
                </div>
              </div>
            ) : registrations.length > 0 ? (
              <Table
                columns={registrationColumns}
                dataSource={registrations}
                rowKey="id"
                pagination={false}
                size="middle"
                scroll={{ x: 800 }}
                style={{
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              />
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: '#6b7280'
              }}>
                <TeamOutlined style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                <div style={{ marginBottom: '16px' }}>
                  Chưa có học sinh nào đăng ký lớp này
                </div>
                <Button
                  type="primary"
                  icon={<UserOutlined />}
                  onClick={showRegisterModal}
                  style={{
                    background: '#722ed1',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  Thêm học sinh đầu tiên
                </Button>
              </div>
            )}
          </Card>
        </Space>

        {/* Register Student Modal */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserOutlined style={{ color: '#722ed1', fontSize: '20px' }} />
              <span>Đăng ký học sinh vào lớp học</span>
            </div>
          }
          open={registerModalVisible}
          onOk={confirmRegisterStudent}
          onCancel={cancelRegisterStudent}
          okText="Đăng ký"
          cancelText="Hủy"
          confirmLoading={registerLoading}
          okButtonProps={{
            style: {
              background: '#722ed1',
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
        >
          <div style={{ padding: '16px 0' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Chọn học sinh:
              </label>
              <Select
                placeholder="Chọn học sinh để đăng ký"
                style={{ width: '100%' }}
                value={selectedStudentId}
                onChange={setSelectedStudentId}
                loading={registerLoading}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {studentsList.map(student => (
                  <Select.Option key={student.id} value={student.id}>
                    {student.name} - {student.currentGrade}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </Modal>

        {/* Unregister Student Confirmation Modal */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DeleteOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
              <span>Xác nhận xóa học sinh khỏi lớp học</span>
            </div>
          }
          open={unregisterModalVisible}
          onOk={confirmUnregisterStudent}
          onCancel={cancelUnregisterStudent}
          okText="Xóa"
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
              Bạn có chắc chắn muốn xóa học sinh này khỏi lớp học không?
            </p>
            {selectedRegistration && (
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
                  <div><strong>ID:</strong> {selectedRegistration.student?.id}</div>
                  <div><strong>Họ và tên:</strong> {selectedRegistration.student?.name}</div>
                  <div><strong>Lớp hiện tại:</strong> {selectedRegistration.student?.currentGrade}</div>
                  <div><strong>Ngày đăng ký:</strong> {formatDate(selectedRegistration.createdAt)}</div>
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
              <strong>⚠️ Lưu ý:</strong> Hành động này sẽ xóa học sinh khỏi lớp học. 
              Học sinh có thể đăng ký lại sau.
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ClassDetailPage;


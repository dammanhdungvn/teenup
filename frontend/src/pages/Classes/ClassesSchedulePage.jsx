import React, { useEffect, useMemo, useState } from 'react';
import { 
  Card, 
  Typography, 
  Table, 
  Tag, 
  Select, 
  Space, 
  App, 
  Spin,
  Button,
  Tooltip,
  Modal,
  Form,
  Input,
  message
} from 'antd';
import { 
  CalendarOutlined, 
  ReloadOutlined,
  UserAddOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { classesApi } from '../../services/classes.api.js';
import { studentsApi } from '../../services/students.api.js';
import { DAY_OF_WEEK_MAP, formatTimeSlot, ERROR_MESSAGE_MAP } from '../../utils/validation.js';
import { handleError } from '../../utils/errorHandler.js';

const { Title, Text } = Typography;

// Tạo mốc thời gian cố định theo giờ (giống như trong ảnh)
const generateTimeSlots = () => {
  const slots = [];
  // Từ 6:00 đến 22:00, mỗi giờ một slot
  for (let hour = 6; hour <= 22; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    slots.push({
      timeSlot: `${startTime}-${endTime}`,
      startTime: startTime,
      endTime: endTime,
      startMinutes: hour * 60,
      endMinutes: (hour + 1) * 60
    });
  }
  return slots;
};

// Chuyển đổi timeSlot thành số phút để tính toán
const parseTimeSlot = (timeSlot) => {
  if (!timeSlot) return { startMinutes: 0, endMinutes: 0 };
  const [start, end] = timeSlot.split('-');
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return {
    startMinutes: sh * 60 + sm,
    endMinutes: eh * 60 + em
  };
};

// Tính toán vị trí và độ cao của class trong lịch
const calculateClassPosition = (classData, timeSlots) => {
  const { startMinutes, endMinutes } = parseTimeSlot(classData.timeSlot);
  

  
  // Tìm slot bắt đầu (slot mà class bắt đầu)
  const startSlotIndex = timeSlots.findIndex(slot => 
    startMinutes >= slot.startMinutes && startMinutes < slot.endMinutes
  );
  
  // Tìm slot kết thúc (slot mà class kết thúc)
  const endSlotIndex = timeSlots.findIndex(slot => 
    endMinutes > slot.startMinutes && endMinutes <= slot.endMinutes
  );
  

  
  // Nếu không tìm thấy slot phù hợp, thử tìm slot gần nhất
  if (startSlotIndex === -1) {
    // Tìm slot gần nhất với thời gian bắt đầu
    const nearestStart = timeSlots.findIndex(slot => 
      startMinutes < slot.endMinutes
    );
    if (nearestStart !== -1) {

      return {
        startSlotIndex: nearestStart,
        spanSlots: 1,
        startMinutes,
        endMinutes
      };
    }
  }
  
  if (startSlotIndex === -1 || endSlotIndex === -1) {

    return null; // Không thể hiển thị
  }
  
  // Tính số slot mà class chiếm
  const spanSlots = Math.max(1, endSlotIndex - startSlotIndex + 1);
  

  
  return {
    startSlotIndex,
    spanSlots,
    startMinutes,
    endMinutes
  };
};

const dayColumns = [1, 2, 3, 4, 5, 6, 7]; // Mon=1, Sun=7

const ClassesSchedulePage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [dayFilter, setDayFilter] = useState('all');
  
  // State cho modal đăng ký
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [form] = Form.useForm();

  // State cho modal xem danh sách học sinh
  const [studentsModalVisible, setStudentsModalVisible] = useState(false);
  const [classStudents, setClassStudents] = useState([]);
  const [classStudentsLoading, setClassStudentsLoading] = useState(false);

  // State cho modal xóa lớp học
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  // State cho modal edit lớp học
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [editForm] = Form.useForm();

  const fetchClasses = async (params = {}) => {
    try {
      setLoading(true);

      
      const resp = await classesApi.getClasses(params);

      
      // Kiểm tra format dữ liệu
      if (resp.data && Array.isArray(resp.data)) {

        setClasses(resp.data);
      } else if (resp.data && resp.data.content && Array.isArray(resp.data.content)) {
        // Nếu backend trả về dạng paginated response

        setClasses(resp.data.content);
      } else {

        setClasses([]);
      }
    } catch (err) {
      handleError(err, message, 'Không thể tải danh sách lớp', 'fetchClasses');
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Lấy danh sách lớp kèm thông tin học sinh đã đăng ký

    fetchClasses({ expand: 'registrations' });
  }, []);

  // Debug: Log khi classes state thay đổi
  useEffect(() => {

  }, [classes]);

  // Tạo dataSource với cấu trúc mới
  const dataSource = useMemo(() => {
    const timeSlots = generateTimeSlots();

    
    const result = timeSlots.map((slot, index) => ({
      key: slot.timeSlot,
      timeSlot: slot.timeSlot,
      startTime: slot.startTime,
      endTime: slot.endTime,
      index: index,
      startMinutes: slot.startMinutes,
      endMinutes: slot.endMinutes
    }));
    

    return result;
  }, [classes]);

  const columns = useMemo(() => {
    const cols = [
      {
        title: (
          <div style={{ textAlign: 'center', fontWeight: 600, color: '#1f2937' }}>
            Thời gian
          </div>
        ),
        dataIndex: 'timeSlot',
        key: 'timeSlot',
        width: 100,
        fixed: 'left',
        align: 'center',
        render: (_, record) => (
          <div style={{ 
            textAlign: 'center',
            fontWeight: 600,
            color: '#374151',
            padding: '8px 4px',
            fontSize: '14px'
          }}>
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>
              {record.startTime}
            </div>
            <div style={{ color: '#6b7280', fontSize: '12px' }}>
              {record.endTime}
            </div>
          </div>
        ),
      },
      ...dayColumns.map((day) => ({
        title: (
          <div style={{ textAlign: 'center', fontWeight: 600, color: '#1f2937' }}>
            {DAY_OF_WEEK_MAP[day]}
          </div>
        ),
        dataIndex: `day${day}`,
        key: `day${day}`,
        width: 160,
        align: 'center',
        render: (_, record) => {
          const dayClasses = classes.filter(c => c.dayOfWeek === day);

          
          if (dayClasses.length === 0) return null;
          
          return (
            <div style={{ position: 'relative', height: '60px' }}>
              {dayClasses.map((classData) => {
                const position = calculateClassPosition(classData, generateTimeSlots());

                
                // Kiểm tra xem class có nằm trong slot thời gian này không
                if (!position) {

                  return null;
                }
                
                // Chỉ render class ở slot bắt đầu của nó để tránh nhân bản
                if (position.startSlotIndex === record.index) {
                  
                  return (
                    <div
                      key={classData.id}
                      className="class-block"
                      style={{
                        height: `${position.spanSlots * 60 - 2}px`,
                        top: '1px',
                        position: 'absolute',
                        left: '1px',
                        right: '1px',
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                        border: '1px solid #bbdefb',
                        borderRadius: '4px',
                        padding: '3px',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        zIndex: 10
                      }}
                    >
                      <div style={{ 
                        fontWeight: 600, 
                        fontSize: '11px',
                        color: '#1565c0',
                        textAlign: 'center',
                        marginBottom: '1px',
                        lineHeight: '1.1'
                      }}>
                        {classData.name}
                      </div>
                      <div style={{ 
                        fontSize: '9px', 
                        color: '#1976d2',
                        textAlign: 'center',
                        marginBottom: '1px',
                        fontWeight: 500
                      }}>
                        {classData.teacherName}
                      </div>
                      <div style={{ textAlign: 'center', marginBottom: '1px' }}>
                        <Tag color="blue" size="small" style={{ fontSize: '8px', padding: '0 2px' }}>
                          {classData.subject}
                        </Tag>
                      </div>
                      <div style={{ 
                        textAlign: 'center',
                        padding: '2px 0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}>
                        {/* Row 1: View & Edit */}
                        <div style={{ display: 'flex', gap: '1px', justifyContent: 'center' }}>
                          <Tooltip title="Xem chi tiết">
                            <Button
                              size="small"
                              icon={<EyeOutlined />}
                              onClick={() => navigate(`/classes/${classData.id}`)}
                              style={{
                                border: '1px solid #1976d2',
                                borderRadius: '3px',
                                fontSize: '7px',
                                padding: '1px 4px',
                                height: '20px',
                                minWidth: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              Xem
                            </Button>
                          </Tooltip>
                          <Tooltip title="Chỉnh sửa">
                            <Button
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() => handleEdit(classData)}
                              style={{
                                border: '1px solid #52c41a',
                                color: '#52c41a',
                                borderRadius: '3px',
                                fontSize: '7px',
                                padding: '1px 4px',
                                height: '20px',
                                minWidth: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              Sửa
                            </Button>
                          </Tooltip>
                        </div>
                        
                        {/* Row 2: Delete & Register */}
                        <div style={{ display: 'flex', gap: '1px', justifyContent: 'center' }}>
                          <Tooltip title="Xóa lớp học">
                            <Button
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={() => showDeleteModal(classData)}
                              style={{
                                borderRadius: '3px',
                                fontSize: '7px',
                                padding: '1px 4px',
                                height: '20px',
                                minWidth: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              Xóa
                            </Button>
                          </Tooltip>
                          <Tooltip title="Đăng ký học sinh">
                            <Button
                              type="primary"
                              size="small"
                              icon={<UserAddOutlined />}
                              onClick={() => handleOpenRegister(classData)}
                              style={{
                                background: '#1976d2',
                                border: 'none',
                                borderRadius: '3px',
                                fontSize: '7px',
                                padding: '1px 4px',
                                height: '20px',
                                minWidth: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              ĐK
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          );
        },
      })),
    ];
    
    return cols;
  }, [classes, navigate]);

  const handleRefresh = () => {
    if (dayFilter && dayFilter !== 'all') {
      fetchClasses({ day: dayFilter, expand: 'registrations' });
    } else {
      fetchClasses({ expand: 'registrations' });
    }
  };

  // Mở modal đăng ký
  const handleOpenRegister = async (classData) => {
    setSelectedClass(classData);
    setRegisterModalVisible(true);
    setStudentsLoading(true);
    
    try {
      // Lấy danh sách học sinh để chọn
      const resp = await studentsApi.getStudentsList();
      setStudents(resp.data || []);
    } catch (err) {
      handleError(err, message, 'Không thể tải danh sách học sinh', 'handleOpenRegister');
    } finally {
      setStudentsLoading(false);
    }
  };

  // Đóng modal đăng ký
  const handleCloseRegister = () => {
    setRegisterModalVisible(false);
    setSelectedClass(null);
    setStudents([]);
    form.resetFields();
  };

  // Xử lý đăng ký học sinh
  const handleRegisterStudent = async (values) => {
    if (!selectedClass) return;
    
    setRegisterLoading(true);
    try {
      await classesApi.registerStudent(selectedClass.id, {
        studentId: values.studentId
      });
      
      message.success('Đăng ký học sinh thành công!');
      handleCloseRegister();
      
      // Refresh danh sách lớp
      if (dayFilter && dayFilter !== 'all') {
        fetchClasses({ day: dayFilter, expand: 'registrations' });
      } else {
        fetchClasses({ expand: 'registrations' });
      }
    } catch (err) {
      console.error('Error registering student:', err);
      const code = err?.response?.data?.code;
      const backendMessage = err?.response?.data?.message;
      if (code && ERROR_MESSAGE_MAP[code]) {
        message.error(ERROR_MESSAGE_MAP[code]);
      } else if (backendMessage) {
        message.error(backendMessage);
      } else {
        message.error('Có lỗi xảy ra khi đăng ký');
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  // Mở modal xem danh sách học sinh
  const handleViewStudents = async (classData) => {
    setSelectedClass(classData);
    setStudentsModalVisible(true);
    setClassStudentsLoading(true);
    
    try {
      // Lấy danh sách học sinh đã đăng ký lớp này
      const resp = await classesApi.getRegistrations(classData.id);
      setClassStudents(resp.data || []);
    } catch (err) {
      handleError(err, message, 'Không thể tải danh sách học sinh', 'handleViewStudents');
    } finally {
      setClassStudentsLoading(false);
    }
  };

  // Đóng modal xem danh sách học sinh
  const handleCloseStudents = () => {
    setStudentsModalVisible(false);
    setSelectedClass(null);
    setClassStudents([]);
  };

  // Hiển thị modal xóa lớp học
  const showDeleteModal = (classData) => {
    setClassToDelete(classData);
    setDeleteModalVisible(true);
  };

  // Xử lý xóa lớp học
  const handleDeleteClass = async () => {
    if (!classToDelete) return;
    
    try {
      await classesApi.deleteClass(classToDelete.id);
      message.success('Xóa lớp học thành công!');
      setDeleteModalVisible(false);
      setClassToDelete(null);
      
      // Refresh danh sách lớp
      if (dayFilter && dayFilter !== 'all') {
        fetchClasses({ day: dayFilter, expand: 'registrations' });
      } else {
        fetchClasses({ expand: 'registrations' });
      }
    } catch (err) {
      handleError(err, message, 'Không thể xóa lớp học', 'handleDeleteClass');
    }
  };

  // Hủy bỏ xóa lớp học
  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setClassToDelete(null);
  };

  // Xử lý edit lớp học
  const handleEdit = (classData) => {
    setEditingClass(classData);
    editForm.setFieldsValue({
      name: classData.name,
      subject: classData.subject,
      dayOfWeek: classData.dayOfWeek,
      timeSlot: classData.timeSlot,
      teacherName: classData.teacherName,
      maxStudents: classData.maxStudents
    });
    setEditModalVisible(true);
  };

  // Xác nhận edit
  const confirmEdit = async () => {
    try {
      const values = await editForm.validateFields();
      
      // Convert maxStudents to number
      const formData = {
        ...values,
        maxStudents: parseInt(values.maxStudents)
      };
      
      await classesApi.updateClass(editingClass.id, formData);
      message.success('Cập nhật lớp học thành công!');
      setEditModalVisible(false);
      setEditingClass(null);
      editForm.resetFields();
      
      // Refresh danh sách lớp
      if (dayFilter && dayFilter !== 'all') {
        fetchClasses({ day: dayFilter, expand: 'registrations' });
      } else {
        fetchClasses({ expand: 'registrations' });
      }
    } catch (err) {
      if (err.errorFields) {
        // Form validation error
        return;
      }
      handleError(err, message, 'Không thể cập nhật lớp học', 'confirmEdit');
    }
  };

  // Hủy edit
  const cancelEdit = () => {
    setEditModalVisible(false);
    setEditingClass(null);
    editForm.resetFields();
  };

  const dayOptions = [
    { label: 'Không lọc theo ngày', value: 'all' },
    ...dayColumns.map((d) => ({ 
      label: DAY_OF_WEEK_MAP[d], 
      value: d 
    })),
  ];

  return (
    <div style={{ 
      background: '#f8fafc', 
      minHeight: '100vh', 
      padding: '32px 24px',
      backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)'
    }}>
      <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 16px' }}>
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
                  <CalendarOutlined style={{ marginRight: '12px', color: '#1890ff', fontSize: '28px' }} />
                  Lịch lớp theo tuần
                </Title>
                <div style={{ color: '#6b7280', marginTop: '4px' }}>
                  Xem lịch học và quản lý lớp theo thời gian
                </div>
              </div>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/classes/new')}
                  style={{
                    background: '#52c41a',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  Tạo lớp mới
                </Button>

                <Select
                  placeholder="Lọc theo thứ"
                  options={dayOptions}
                  value={dayFilter}
                  style={{ width: 180 }}
                  onChange={(v) => {
                    setDayFilter(v);
                    if (v && v !== 'all') {
                      fetchClasses({ day: v, expand: 'registrations' });
                    } else {
                      fetchClasses({ expand: 'registrations' });
                    }
                  }}
                />
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  style={{
                    background: '#1890ff',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  Làm mới
                </Button>
              </Space>
            </div>
          </Card>

          {/* Schedule Table */}
          <Card style={{ 
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            overflow: 'auto'
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px', color: '#6b7280' }}>
                  Đang tải lịch lớp...
                </div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  rowKey="timeSlot"
                  pagination={false}
                  scroll={false}
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    minWidth: '1100px'
                  }}
                  className="schedule-table"
                  bordered={true}
                  size="middle"
                  rowClassName={(record, index) => 'schedule-row'}
                  responsive={false}
                  locale={{
                    emptyText: (
                      <div style={{ textAlign: 'center', padding: '40px' }}>
                        <CalendarOutlined style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '16px' }} />
                        <div style={{ color: '#6b7280' }}>Chưa có lớp học nào</div>
                      </div>
                    ),
                  }}
                />
              </div>
            )}
          </Card>
        </Space>
      </div>

      {/* Modal đăng ký học sinh */}
      <Modal
        title={
          <div style={{ textAlign: 'center' }}>
            <UserAddOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            Đăng ký học sinh vào lớp
          </div>
        }
        open={registerModalVisible}
        onCancel={handleCloseRegister}
        footer={null}
        width={600}
        centered
      >
        {selectedClass && (
          <div style={{ marginBottom: '24px' }}>
            <Card 
              size="small" 
              styles={{ 
                body: { padding: '16px' },
                header: { background: '#f8fafc' }
              }}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ fontWeight: 600, fontSize: '16px', color: '#1f2937' }}>
                  {selectedClass.name}
                </div>
                <div style={{ color: '#6b7280' }}>
                  {DAY_OF_WEEK_MAP[selectedClass.dayOfWeek]} • {formatTimeSlot(selectedClass.timeSlot)}
                </div>
                <div style={{ color: '#6b7280' }}>
                  Giáo viên: {selectedClass.teacherName} • Môn: {selectedClass.subject}
                </div>
                <div style={{ color: '#6b7280' }}>
                  Số học sinh hiện tại: {selectedClass.maxStudents}
                </div>
              </Space>
            </Card>
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegisterStudent}
        >
          <Form.Item
            label="Chọn học sinh"
            name="studentId"
            rules={[
              { required: true, message: 'Vui lòng chọn học sinh' }
            ]}
          >
            <Select
              placeholder="Chọn học sinh để đăng ký"
              loading={studentsLoading}
              showSearch
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
              options={students.map(student => ({
                label: `${student.name} (${student.currentGrade})`,
                value: student.id
              }))}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCloseRegister}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={registerLoading}
                icon={<UserAddOutlined />}
                style={{
                  background: '#52c41a',
                  border: 'none'
                }}
              >
                Đăng ký
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem danh sách học sinh */}
      <Modal
        title={
          <div style={{ textAlign: 'center' }}>
            <UserAddOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            Danh sách học sinh đã đăng ký
          </div>
        }
        open={studentsModalVisible}
        onCancel={handleCloseStudents}
        footer={null}
        width={600}
        centered
      >
        {selectedClass && (
          <div style={{ marginBottom: '24px' }}>
            <Card 
              size="small" 
              styles={{ 
                body: { padding: '16px' },
                header: { background: '#f8fafc' }
              }}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ fontWeight: 600, fontSize: '16px', color: '#1f2937' }}>
                  {selectedClass.name}
                </div>
                <div style={{ color: '#6b7280' }}>
                  {DAY_OF_WEEK_MAP[selectedClass.dayOfWeek]} • {formatTimeSlot(selectedClass.timeSlot)}
                </div>
                <div style={{ color: '#6b7280' }}>
                  Giáo viên: {selectedClass.teacherName} • Môn: {selectedClass.subject}
                </div>
                <div style={{ color: '#6b7280' }}>
                  Số học sinh: {classStudents.length}/{selectedClass.maxStudents}
                </div>
              </Space>
            </Card>
          </div>
        )}

        {classStudentsLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', color: '#6b7280' }}>
              Đang tải danh sách học sinh...
            </div>
          </div>
        ) : classStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <UserAddOutlined style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '16px' }} />
            <div style={{ color: '#6b7280' }}>Chưa có học sinh nào đăng ký</div>
          </div>
        ) : (
          <div>
            <div style={{ 
              marginBottom: '16px', 
              fontWeight: 600, 
              color: '#1f2937',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Danh sách học sinh ({classStudents.length}):</span>
              <Text style={{ fontSize: '12px', color: '#6b7280' }}>
                Click vào học sinh để xem chi tiết
              </Text>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {classStudents.map((student, index) => (
                <Card
                  key={student.id}
                  size="small"
                  hoverable
                  onClick={() => {
                    handleCloseStudents();
                    navigate(`/students/${student.id}`, { 
                      state: { from: 'classes' } 
                    });
                  }}
                  style={{ 
                    marginBottom: '8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
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
                        {student.currentGrade}
                      </div>
                    </div>
                    <div style={{ color: '#1890ff', fontSize: '12px' }}>
                      <UserAddOutlined /> Xem chi tiết
                    </div>
                  </Space>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Class Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <EditOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
            <span>Chỉnh sửa lớp học</span>
          </div>
        }
        open={editModalVisible}
        onOk={confirmEdit}
        onCancel={cancelEdit}
        okText="Cập nhật"
        cancelText="Hủy"
        width={700}
        centered
      >
        {editingClass && (
          <Form
            form={editForm}
            layout="vertical"
            style={{ marginTop: '16px' }}
          >
            <Form.Item
              name="name"
              label="Tên lớp"
              rules={[
                { required: true, message: 'Vui lòng nhập tên lớp!' },
                { min: 2, message: 'Tên lớp phải có ít nhất 2 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập tên lớp" />
            </Form.Item>

            <Form.Item
              name="subject"
              label="Môn học"
              rules={[
                { required: true, message: 'Vui lòng chọn môn học!' }
              ]}
            >
              <Select placeholder="Chọn môn học">
                <Select.Option value="Math">Toán học</Select.Option>
                <Select.Option value="Literature">Văn học</Select.Option>
                <Select.Option value="English">Tiếng Anh</Select.Option>
                <Select.Option value="Physics">Vật lý</Select.Option>
                <Select.Option value="Chemistry">Hóa học</Select.Option>
                <Select.Option value="Biology">Sinh học</Select.Option>
                <Select.Option value="History">Lịch sử</Select.Option>
                <Select.Option value="Geography">Địa lý</Select.Option>
                <Select.Option value="Computer">Tin học</Select.Option>
                <Select.Option value="Art">Mỹ thuật</Select.Option>
                <Select.Option value="Music">Âm nhạc</Select.Option>
                <Select.Option value="Physical">Thể dục</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="dayOfWeek"
              label="Thứ trong tuần"
              rules={[
                { required: true, message: 'Vui lòng chọn thứ!' }
              ]}
            >
              <Select placeholder="Chọn thứ">
                {dayColumns.map((day) => (
                  <Select.Option key={day} value={day}>
                    {DAY_OF_WEEK_MAP[day]}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="timeSlot"
              label="Thời gian học"
              rules={[
                { required: true, message: 'Vui lòng nhập thời gian học!' },
                { pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/, message: 'Định dạng thời gian không hợp lệ (HH:MM-HH:MM)!' }
              ]}
            >
              <Input placeholder="VD: 14:00-15:30" />
            </Form.Item>

            <Form.Item
              name="teacherName"
              label="Tên giáo viên"
              rules={[
                { required: true, message: 'Vui lòng nhập tên giáo viên!' },
                { min: 2, message: 'Tên giáo viên phải có ít nhất 2 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập tên giáo viên" />
            </Form.Item>

            <Form.Item
              name="maxStudents"
              label="Số học sinh tối đa"
              rules={[
                { required: true, message: 'Vui lòng nhập số học sinh tối đa!' },
                { 
                  validator: (_, value) => {
                    const num = parseInt(value);
                    if (isNaN(num)) {
                      return Promise.reject(new Error('Vui lòng nhập số hợp lệ!'));
                    }
                    if (num < 1 || num > 50) {
                      return Promise.reject(new Error('Số học sinh phải từ 1-50!'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input type="number" placeholder="Nhập số học sinh tối đa" min="1" max="50" />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DeleteOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
            <span>Xác nhận xóa lớp học</span>
          </div>
        }
        open={deleteModalVisible}
        onOk={handleDeleteClass}
        onCancel={handleCancelDelete}
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
            Bạn có chắc chắn muốn xóa lớp học này không?
          </p>
          {classToDelete && (
            <div style={{ 
              background: '#f8f9fa', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>
                Thông tin lớp học:
              </div>
              <div style={{ color: '#6b7280' }}>
                <div><strong>ID:</strong> {classToDelete.id}</div>
                <div><strong>Tên lớp:</strong> {classToDelete.name}</div>
                <div><strong>Môn học:</strong> {classToDelete.subject}</div>
                <div><strong>Thứ:</strong> {DAY_OF_WEEK_MAP[classToDelete.dayOfWeek]}</div>
                <div><strong>Thời gian:</strong> {formatTimeSlot(classToDelete.timeSlot)}</div>
                <div><strong>Số học sinh tối đa:</strong> {classToDelete.maxStudents}</div>
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
            <strong>⚠️ Lưu ý:</strong> Hành động này không thể hoàn tác. 
            Tất cả học sinh đã đăng ký sẽ bị ảnh hưởng.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClassesSchedulePage;

// CSS styles for responsive design
const styles = `
  .schedule-table {
    font-size: 11px;
  }
  
  .schedule-table .ant-table-thead > tr > th {
    padding: 6px 3px;
    font-size: 11px;
    font-weight: 600;
  }
  
  .schedule-table .ant-table-tbody > tr > td {
    padding: 3px;
    font-size: 10px;
  }
  
  .class-block {
    transition: all 0.2s ease;
    overflow: hidden;
  }
  
  .class-block:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
  
  .class-block button {
    font-size: 7px !important;
    padding: 1px 3px !important;
    height: 18px !important;
    min-width: 26px !important;
    line-height: 1 !important;
  }
  
  @media (max-width: 768px) {
    .schedule-table {
      font-size: 9px;
    }
    
    .schedule-table .ant-table-thead > tr > th {
      padding: 3px 2px;
      font-size: 9px;
    }
    
    .schedule-table .ant-table-tbody > tr > td {
      padding: 2px;
      font-size: 8px;
    }
    
    .class-block {
      padding: 2px;
    }
    
    .class-block button {
      font-size: 6px !important;
      padding: 1px 2px !important;
      height: 16px !important;
      min-width: 24px !important;
    }
  }
  
  @media (max-width: 480px) {
    .schedule-table {
      font-size: 8px;
    }
    
    .schedule-table .ant-table-thead > tr > th {
      padding: 2px 1px;
      font-size: 8px;
    }
    
    .schedule-table .ant-table-tbody > tr > td {
      padding: 1px;
      font-size: 7px;
    }
    
    .class-block {
      padding: 1px;
    }
    
    .class-block button {
      font-size: 5px !important;
      padding: 1px 1px !important;
      height: 14px !important;
      min-width: 20px !important;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

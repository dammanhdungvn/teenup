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
  message
} from 'antd';
import { 
  CalendarOutlined, 
  ReloadOutlined,
  UserAddOutlined,
  PlusOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { classesApi } from '../../services/classes.api.js';
import { studentsApi } from '../../services/students.api.js';
import { DAY_OF_WEEK_MAP, formatTimeSlot, ERROR_MESSAGE_MAP } from '../../utils/validation.js';

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
      console.error('Error fetching classes:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      message.error('Không thể tải danh sách lớp');
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
        width: 120,
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
        width: 200,
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
                        height: `${position.spanSlots * 60 - 4}px`,
                        top: '2px'
                      }}
                    >
                      <div style={{ 
                        fontWeight: 600, 
                        fontSize: '12px',
                        color: '#1565c0',
                        textAlign: 'center',
                        marginBottom: '2px',
                        lineHeight: '1.2'
                      }}>
                        {classData.name}
                      </div>
                      <div style={{ 
                        fontSize: '10px', 
                        color: '#1976d2',
                        textAlign: 'center',
                        marginBottom: '2px',
                        fontWeight: 500
                      }}>
                        {classData.teacherName}
                      </div>
                      <div style={{ textAlign: 'center', marginBottom: '2px' }}>
                        <Tag color="blue" size="small" style={{ fontSize: '9px', padding: '0 4px' }}>
                          {classData.subject}
                        </Tag>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <Space size="small">
                          <Tooltip title="Xem danh sách học sinh">
                            <Button
                              size="small"
                              onClick={() => handleViewStudents(classData)}
                              style={{
                                border: '1px solid #1976d2',
                                borderRadius: '4px',
                                fontSize: '9px',
                                padding: '1px 4px',
                                height: '20px',
                                minWidth: '40px'
                              }}
                            >
                              Xem
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
                                borderRadius: '4px',
                                fontSize: '9px',
                                padding: '1px 4px',
                                height: '20px',
                                minWidth: '40px'
                              }}
                            >
                              ĐK
                            </Button>
                          </Tooltip>
                        </Space>
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
      message.error('Không thể tải danh sách học sinh');
      console.error('Error fetching students:', err);
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
      message.error('Không thể tải danh sách học sinh');
      console.error('Error fetching class students:', err);
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
              <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="timeSlot"
                pagination={false}
                scroll={{ x: 'max-content' }}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  width: '100%'
                }}
                className="schedule-table"
                bordered={true}
                size="middle"
                rowClassName={(record, index) => 'schedule-row'}
                locale={{
                  emptyText: (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <CalendarOutlined style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '16px' }} />
                      <div style={{ color: '#6b7280' }}>Chưa có lớp học nào</div>
                    </div>
                  ),
                }}
              />
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
    </div>
  );
};

export default ClassesSchedulePage;

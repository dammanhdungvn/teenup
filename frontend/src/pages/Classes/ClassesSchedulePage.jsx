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
  UserAddOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { classesApi } from '../../services/classes.api.js';
import { studentsApi } from '../../services/students.api.js';
import { DAY_OF_WEEK_MAP, formatTimeSlot, ERROR_MESSAGE_MAP } from '../../utils/validation.js';

const { Title, Text } = Typography;

// Tạo mốc thời gian cố định theo giờ
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 6; hour <= 22; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    slots.push(`${startTime}-${endTime}`);
  }
  return slots;
};

// Chuẩn hóa timeSlot: HH:mm-HH:mm → số phút bắt đầu để sort
const parseTimeSlot = (timeSlot) => {
  const [start] = timeSlot.split('-');
  const [sh, sm] = start.split(':').map(Number);
  return sh * 60 + sm;
};

// Lấy danh sách timeSlot cố định và sort theo start time
const buildTimeRows = (classes) => {
  
  
  // Luôn tạo mốc thời gian cố định từ 6h-22h
  const fixedTimeSlots = generateTimeSlots();
  
  
  return fixedTimeSlots;
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
      message.error('Không thể tải danh sách lớp');
      // console.error('Error fetching classes:', err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses({});
  }, []);

  const timeRows = useMemo(() => {
    
    const rows = buildTimeRows(classes);
    
    return rows;
  }, [classes]);

  // Xây dataSource: mỗi row là 1 timeSlot, các cột theo dayOfWeek
  const dataSource = useMemo(() => {
    
    const result = timeRows.map((time) => {
      const row = { key: time, timeSlot: time };
      dayColumns.forEach((day) => {
        // Tìm lớp học phù hợp với timeSlot và dayOfWeek
        const items = classes.filter((c) => {
          // Kiểm tra xem lớp có trùng với mốc thời gian này không
          const classStart = c.timeSlot.split('-')[0]; // Lấy thời gian bắt đầu của lớp
          const timeStart = time.split('-')[0]; // Lấy thời gian bắt đầu của mốc
          
          // So sánh thời gian bắt đầu (chính xác hoặc gần nhất)
          const classHour = parseInt(classStart.split(':')[0]);
          const timeHour = parseInt(timeStart.split(':')[0]);
          
          return c.dayOfWeek === day && classHour === timeHour;
        });
        row[`day_${day}`] = items;
      });
      return row;
    });
    
    return result;
  }, [timeRows, classes]);

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
        width: 160,
        fixed: 'left',
        align: 'center',
        render: (t) => {
          
          return (
            <div style={{ textAlign: 'center' }}>
              <Tag color="geekblue" style={{ fontSize: '14px', padding: '8px 12px' }}>
                {formatTimeSlot(t)}
              </Tag>
            </div>
          );
        },
      },
      ...dayColumns.map((day) => ({
        title: (
          <div style={{ textAlign: 'center', fontWeight: 600 }}>
            {DAY_OF_WEEK_MAP[day]}
          </div>
        ),
        dataIndex: `day_${day}`,
        key: `day_${day}`,
        align: 'center',
        width: 'auto',
        minWidth: 180,
        render: (list) => {
          
          if (!list || list.length === 0) {
            return (
              <div style={{ 
                color: '#d9d9d9', 
                fontSize: '14px',
                padding: '20px 0',
                textAlign: 'center'
              }}>
                —
              </div>
            );
          }
          
          return (
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              {list.map((c) => (
                <Card
                  key={c.id}
                  size="small"
                  styles={{ body: { padding: 12 } }}
                  style={{ 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <Space direction="vertical" size={6} style={{ width: '100%' }}>
                    <div style={{ 
                      fontWeight: 600, 
                      fontSize: '14px',
                      color: '#1f2937',
                      textAlign: 'center'
                    }}>
                      {c.name}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#6b7280',
                      textAlign: 'center'
                    }}>
                      {c.teacherName}
                    </div>
                    <Space size={4} wrap style={{ justifyContent: 'center' }}>
                      <Tag color="green" size="small">{c.subject}</Tag>
                      <Tag color="purple" size="small">Max {c.maxStudents}</Tag>
                    </Space>
                    <div style={{ textAlign: 'center', marginTop: '4px' }}>
                                             <Tooltip title="Đăng ký học sinh">
                         <Button
                           type="primary"
                           size="small"
                           icon={<UserAddOutlined />}
                           onClick={() => handleOpenRegister(c)}
                           style={{
                             background: '#52c41a',
                             border: 'none',
                             borderRadius: '6px'
                           }}
                         >
                           Đăng ký
                         </Button>
                       </Tooltip>
                    </div>
                  </Space>
                </Card>
              ))}
            </Space>
          );
        },
      })),
    ];
    
    return cols;
  }, [navigate]);

  const handleRefresh = () => {
    if (dayFilter && dayFilter !== 'all') {
      fetchClasses({ day: dayFilter });
    } else {
      fetchClasses({});
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
        fetchClasses({ day: dayFilter });
      } else {
        fetchClasses({});
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
                                 <Select
                   placeholder="Lọc theo thứ"
                   options={dayOptions}
                   value={dayFilter}
                   style={{ width: 180 }}
                   onChange={(v) => {
                    
                     setDayFilter(v);
                     if (v && v !== 'all') {
                       fetchClasses({ day: v });
                     } else {
                       fetchClasses({});
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
             <Card size="small" style={{ background: '#f8fafc' }}>
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
     </div>
   );
 };

export default ClassesSchedulePage;

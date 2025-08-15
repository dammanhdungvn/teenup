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
  Select,
  Modal,
  Form,
  Input,
  DatePicker
} from 'antd';
import { 
  UserOutlined, 
  PlusOutlined, 
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { studentsApi } from '../../services/students.api.js';
import { parentsApi } from '../../services/parents.api.js';
import { GENDER_OPTIONS, GRADE_OPTIONS } from '../../utils/validation.js';
import dayjs from 'dayjs';

const { Title } = Typography;

const StudentsListPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { message } = App.useApp();

  // State cho modals
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [editForm] = Form.useForm();
  const [parents, setParents] = useState([]);

  useEffect(() => {
    fetchStudents();
    fetchParents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsApi.getStudentsList();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      const backendMessage = error?.response?.data?.message;
      if (backendMessage) {
        message.error(backendMessage);
      } else {
        message.error('Không thể tải danh sách học sinh');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchParents = async () => {
    try {
      const response = await parentsApi.getParentsList();
      setParents(response.data || []);
    } catch (error) {
      console.error('Error fetching parents:', error);
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
      width: 120,
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
      width: 350,
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
            <div style={{ fontWeight: 700, color: '#1f2937', fontSize: '16px' }}>
              {name}
            </div>
            <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '2px' }}>
              Học sinh
            </div>
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
      title: 'Phụ huynh',
      dataIndex: 'parent',
      key: 'parent',
      width: 250,
      align: 'left',
      render: (parent) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '14px' }}>
            {parent?.name || 'N/A'}
          </div>
          <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>
            {parent?.phone || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 300,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle" direction="horizontal">
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
                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.2)',
                width: 'auto'
              }}
            >
              Xem
            </Button>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="middle"
              style={{
                border: '2px solid #52c41a',
                color: '#52c41a',
                borderRadius: '8px',
                padding: '8px 16px',
                fontWeight: 600,
                background: 'transparent',
                width: 'auto'
              }}
            >
              Sửa
            </Button>
          </Tooltip>
          <Tooltip title="Xóa học sinh">
            <Button
              type="default"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              size="middle"
              style={{
                border: '2px solid #ff4d4f',
                color: '#ff4d4f',
                borderRadius: '8px',
                padding: '8px 16px',
                fontWeight: 600,
                background: 'transparent',
                width: 'auto'
              }}
            >
              Xóa
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

  // Xử lý edit student
  const handleEdit = (student) => {
    setEditingStudent(student);
    editForm.setFieldsValue({
      name: student.name,
      dob: student.dob ? dayjs(student.dob) : null,
      gender: student.gender,
      currentGrade: student.currentGrade,
      parentId: student.parentId
    });
    setEditModalVisible(true);
  };

  // Xác nhận edit
  const confirmEdit = async () => {
    try {
      const values = await editForm.validateFields();
      const updateData = {
        ...values,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : null
      };
      
      await studentsApi.updateStudent(editingStudent.id, updateData);
      message.success('Cập nhật học sinh thành công!');
      setEditModalVisible(false);
      setEditingStudent(null);
      editForm.resetFields();
      fetchStudents(); // Refresh data
    } catch (err) {
      if (err.errorFields) {
        // Form validation error
        return;
      }
      const backendMessage = err?.response?.data?.message;
      if (backendMessage) {
        message.error(backendMessage);
      } else {
        message.error('Không thể cập nhật học sinh');
      }
    }
  };

  // Hủy edit
  const cancelEdit = () => {
    setEditModalVisible(false);
    setEditingStudent(null);
    editForm.resetFields();
  };

  // Xử lý delete student
  const handleDelete = (student) => {
    setDeletingStudent(student);
    setDeleteModalVisible(true);
  };

  // Xác nhận delete
  const confirmDelete = async () => {
    if (!deletingStudent) return;
    
    try {
      await studentsApi.deleteStudent(deletingStudent.id);
      message.success('Xóa học sinh thành công');
      setDeleteModalVisible(false);
      setDeletingStudent(null);
      fetchStudents(); // Refresh danh sách
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      if (backendMessage) {
        message.error(backendMessage);
      } else {
        message.error('Không thể xóa học sinh');
      }
    }
  };

  // Hủy delete
  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setDeletingStudent(null);
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
            <div style={{ overflowX: 'auto', width: '100%' }}>
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
                  overflow: 'hidden',
                  minWidth: '1000px'
                }}
                size="middle"
                scroll={false}
                responsive={false}
              />
            </div>
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

        {/* Edit Student Modal */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EditOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
              <span>Chỉnh sửa học sinh</span>
            </div>
          }
          open={editModalVisible}
          onOk={confirmEdit}
          onCancel={cancelEdit}
          okText="Cập nhật"
          cancelText="Hủy"
          width={600}
          centered
        >
          {editingStudent && (
            <Form
              form={editForm}
              layout="vertical"
              style={{ marginTop: '16px' }}
            >
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
              >
                <Input placeholder="Nhập họ và tên học sinh" />
              </Form.Item>

              <Form.Item
                name="dob"
                label="Ngày sinh"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  placeholder="Chọn ngày sinh"
                  format="DD/MM/YYYY"
                />
              </Form.Item>

              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
              >
                <Select placeholder="Chọn giới tính">
                  {GENDER_OPTIONS.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="currentGrade"
                label="Lớp hiện tại"
                rules={[{ required: true, message: 'Vui lòng chọn lớp!' }]}
              >
                <Select placeholder="Chọn lớp">
                  {GRADE_OPTIONS.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="parentId"
                label="Phụ huynh"
                rules={[{ required: true, message: 'Vui lòng chọn phụ huynh!' }]}
              >
                <Select 
                  placeholder="Chọn phụ huynh"
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {parents.map(parent => (
                    <Select.Option key={parent.id} value={parent.id}>
                      {parent.name} - {parent.phone}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DeleteOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
              <span>Xác nhận xóa học sinh</span>
            </div>
          }
          open={deleteModalVisible}
          onOk={confirmDelete}
          onCancel={cancelDelete}
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
        >
          <div style={{ padding: '16px 0' }}>
            <p>Bạn có chắc chắn muốn xóa học sinh <strong>"{deletingStudent?.name}"</strong>?</p>
            <p style={{ color: '#ff4d4f', fontSize: '14px' }}>
              Hành động này không thể hoàn tác!
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default StudentsListPage;

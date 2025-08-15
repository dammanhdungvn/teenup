import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  DatePicker, 
  Space, 
  Typography, 
  App,
  Spin,
  Row,
  Col
} from 'antd';
import { 
  UserOutlined, 
  ArrowLeftOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { studentsApi } from '../../services/students.api.js';
import { parentsApi } from '../../services/parents.api.js';
import { GENDER_OPTIONS, GRADE_OPTIONS } from '../../utils/validation.js';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const EditStudentPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parents, setParents] = useState([]);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch student data
      const studentResponse = await studentsApi.getStudentById(id);
      setStudent(studentResponse.data);
      
      // Fetch parents list
      const parentsResponse = await parentsApi.getParentsList();
      setParents(parentsResponse.data || []);
      
      // Set form values
      form.setFieldsValue({
        name: studentResponse.data.name,
        dob: dayjs(studentResponse.data.dob),
        gender: studentResponse.data.gender,
        currentGrade: studentResponse.data.currentGrade,
        parentId: studentResponse.data.parent?.id || studentResponse.data.parentId
      });
    } catch (error) {
      message.error('Không thể tải thông tin học sinh');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setSaving(true);
      
      const studentData = {
        name: values.name,
        dob: values.dob.format('YYYY-MM-DD'),
        gender: values.gender,
        currentGrade: values.currentGrade,
        parentId: values.parentId
      };

      await studentsApi.updateStudent(id, studentData);
      message.success('Cập nhật học sinh thành công');
      navigate(`/students/${id}`);
    } catch (error) {
      message.error('Không thể cập nhật học sinh');
      console.error('Error updating student:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate(`/students/${id}`);
  };

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
            Đang tải thông tin học sinh...
          </div>
        </div>
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
                  <UserOutlined style={{ marginRight: '12px', color: '#1890ff', fontSize: '28px' }} />
                  Chỉnh sửa học sinh
                </Title>
                <div style={{ color: '#6b7280', marginTop: '4px' }}>
                  Cập nhật thông tin học sinh: {student?.name}
                </div>
              </div>
              <Space>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={handleBack}
                  style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: '8px'
                  }}
                >
                  Quay lại
                </Button>
              </Space>
            </div>
          </Card>

          {/* Edit Form */}
          <Card style={{ 
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              style={{ maxWidth: '800px', margin: '0 auto' }}
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[
                      { required: true, message: 'Vui lòng nhập họ và tên' },
                      { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự' }
                    ]}
                  >
                    <Input 
                      placeholder="Nhập họ và tên học sinh"
                      size="large"
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="dob"
                    label="Ngày sinh"
                    rules={[
                      { required: true, message: 'Vui lòng chọn ngày sinh' }
                    ]}
                  >
                    <DatePicker
                      placeholder="Chọn ngày sinh"
                      size="large"
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="gender"
                    label="Giới tính"
                    rules={[
                      { required: true, message: 'Vui lòng chọn giới tính' }
                    ]}
                  >
                    <Select
                      placeholder="Chọn giới tính"
                      size="large"
                    >
                      {GENDER_OPTIONS.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="currentGrade"
                    label="Lớp hiện tại"
                    rules={[
                      { required: true, message: 'Vui lòng chọn lớp hiện tại' }
                    ]}
                  >
                    <Select
                      placeholder="Chọn lớp hiện tại"
                      size="large"
                    >
                      {GRADE_OPTIONS.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24}>
                  <Form.Item
                    name="parentId"
                    label="Phụ huynh"
                    rules={[
                      { required: true, message: 'Vui lòng chọn phụ huynh' }
                    ]}
                  >
                    <Select
                      placeholder="Chọn phụ huynh"
                      size="large"
                      showSearch
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {parents.map(parent => (
                        <Option key={parent.id} value={parent.id}>
                          {parent.name} - {parent.phone}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ marginTop: '32px', textAlign: 'center' }}>
                <Space size="large">
                  <Button
                    onClick={handleBack}
                    size="large"
                    style={{
                      border: '1px solid #d9d9d9',
                      borderRadius: '8px',
                      height: '40px',
                      padding: '0 20px'
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={saving}
                    size="large"
                    style={{
                      background: '#52c41a',
                      border: 'none',
                      borderRadius: '8px',
                      height: '40px',
                      padding: '0 20px'
                    }}
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </div>
    </div>
  );
};

export default EditStudentPage;

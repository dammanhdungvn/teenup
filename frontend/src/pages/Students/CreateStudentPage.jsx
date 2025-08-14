import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Spin,
  Row,
  Col,
  App
} from 'antd';
import { UserAddOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { studentsApi } from '../../services/students.api.js';
import { parentsApi } from '../../services/parents.api.js';
import { GENDER_OPTIONS, GRADE_OPTIONS, validateRequired, validateDate } from '../../utils/validation.js';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const CreateStudentPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [parents, setParents] = useState([]);
  const [loadingParents, setLoadingParents] = useState(true);

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      setLoadingParents(true);
      const response = await parentsApi.getParentsList();
      setParents(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách phụ huynh');
      console.error('Error fetching parents:', error);
    } finally {
      setLoadingParents(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      // Format data for API
      const studentData = {
        name: values.name.trim(),
        dob: values.dob.format('YYYY-MM-DD'),
        gender: values.gender,
        currentGrade: values.currentGrade,
        parentId: values.parentId,
      };

      await studentsApi.createStudent(studentData);
      
      message.success('Tạo học sinh thành công!');
      navigate('/students/list');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tạo học sinh';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/students/list');
  };

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            type="text"
            size="large"
          />
          <Title level={2} style={{ margin: 0 }}>
            <UserAddOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            Thêm học sinh mới
          </Title>
        </div>

        {/* Form */}
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              gender: 'M',
              currentGrade: 'Grade 8',
            }}
            requiredMark={false}
          >
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="Họ và tên"
                  name="name"
                  rules={[
                    { required: true, message: 'Vui lòng nhập họ và tên' },
                    { validator: (_, value) => 
                      validateRequired(value) ? Promise.resolve() : Promise.reject('Họ và tên không được để trống')
                    }
                  ]}
                >
                  <Input 
                    placeholder="Nhập họ và tên học sinh"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="Ngày sinh"
                  name="dob"
                  rules={[
                    { required: true, message: 'Vui lòng chọn ngày sinh' },
                    { validator: (_, value) => 
                      validateDate(value) ? Promise.resolve() : Promise.reject('Ngày sinh không hợp lệ')
                    }
                  ]}
                >
                  <DatePicker
                    placeholder="Chọn ngày sinh"
                    size="large"
                    style={{ width: '100%' }}
                    disabledDate={(current) => current && current > dayjs().endOf('day')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="Giới tính"
                  name="gender"
                  rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                >
                  <Select
                    placeholder="Chọn giới tính"
                    size="large"
                    options={GENDER_OPTIONS}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="Lớp hiện tại"
                  name="currentGrade"
                  rules={[{ required: true, message: 'Vui lòng chọn lớp hiện tại' }]}
                >
                  <Select
                    placeholder="Chọn lớp hiện tại"
                    size="large"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    options={GRADE_OPTIONS}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="Phụ huynh"
                  name="parentId"
                  rules={[{ required: true, message: 'Vui lòng chọn phụ huynh' }]}
                >
                  <Select
                    placeholder="Chọn phụ huynh"
                    size="large"
                    loading={loadingParents}
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {parents.map(parent => (
                      <Option key={parent.id} value={parent.id}>
                        {parent.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ marginTop: '32px', textAlign: 'center' }}>
              <Space size="large">
                <Button 
                  size="large" 
                  onClick={handleBack}
                  style={{ minWidth: '120px' }}
                >
                  Hủy
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large"
                  loading={loading}
                  icon={<SaveOutlined />}
                  style={{ minWidth: '120px' }}
                >
                  {loading ? 'Đang tạo...' : 'Tạo học sinh'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </div>
  );
};

export default CreateStudentPage;

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Form, 
  Input, 
  Button, 
  Space, 
  App, 
  Row,
  Col,
  Select,
  InputNumber,
  DatePicker
} from 'antd';
import { 
  GiftOutlined, 
  ArrowLeftOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { subscriptionsApi } from '../../services/subscriptions.api.js';
import { studentsApi } from '../../services/students.api.js';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const CreateSubscriptionPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setStudentsLoading(true);
      const response = await studentsApi.getStudentsList();
      setStudents(response.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách học sinh');
      console.error('Error fetching students:', error);
    } finally {
      setStudentsLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      // Format date values
      const formattedValues = {
        studentId: values.studentId,
        packageName: values.packageName,
        totalSessions: values.totalSessions,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
        description: values.description || null,
      };

      await subscriptionsApi.createSubscription(formattedValues);
      message.success('Tạo gói học thành công!');
      navigate('/subscriptions');
    } catch (error) {
      console.error('Error creating subscription:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Không thể tạo gói học. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/subscriptions');
  };

  return (
    <div style={{ 
      background: '#f8fafc', 
      minHeight: '100vh', 
      padding: '32px 24px',
      backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        padding: { xs: '0 16px', sm: '0 20px', md: '0 24px' }
      }}>
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
                  <GiftOutlined style={{ marginRight: '12px', color: '#fa8c16', fontSize: '28px' }} />
                  Tạo gói học mới
                </Title>
                <div style={{ color: '#6b7280', marginTop: '4px' }}>
                  Nhập thông tin gói học để thêm vào hệ thống
                </div>
              </div>
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
            </div>
          </Card>

          {/* Form */}
          <Card style={{ 
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              style={{ marginTop: '16px' }}
            >
              <Row gutter={[24, 16]}>
                {/* Tên gói học */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600, color: '#374151' }}>
                        Tên gói học <Text type="danger">*</Text>
                      </span>
                    }
                    name="packageName"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên gói học' },
                      { min: 2, message: 'Tên gói phải có ít nhất 2 ký tự' },
                      { max: 100, message: 'Tên gói không được quá 100 ký tự' }
                    ]}
                  >
                    <Input
                      placeholder="Nhập tên gói học"
                      size="large"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #d1d5db'
                      }}
                    />
                  </Form.Item>
                </Col>

                {/* Học sinh */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600, color: '#374151' }}>
                        Học sinh <Text type="danger">*</Text>
                      </span>
                    }
                    name="studentId"
                    rules={[
                      { required: true, message: 'Vui lòng chọn học sinh' }
                    ]}
                  >
                    <Select
                      placeholder="Chọn học sinh"
                      size="large"
                      loading={studentsLoading}
                      showSearch
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      style={{
                        borderRadius: '8px'
                      }}
                    >
                      {students.map(student => (
                        <Option key={student.id} value={student.id}>
                          {student.name} (ID: {student.id})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* Số buổi học */}
                <Col xs={24} md={24}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600, color: '#374151' }}>
                        Số buổi học <Text type="danger">*</Text>
                      </span>
                    }
                    name="totalSessions"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số buổi học' },
                      { type: 'number', min: 1, message: 'Số buổi phải lớn hơn 0' },
                      { type: 'number', max: 100, message: 'Số buổi không được quá 100' }
                    ]}
                  >
                    <InputNumber
                      placeholder="Nhập số buổi học"
                      size="large"
                      min={1}
                      max={100}
                      style={{
                        width: '100%',
                        borderRadius: '8px'
                      }}
                    />
                  </Form.Item>
                </Col>



                {/* Ngày bắt đầu */}
                <Col xs={24} md={24}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600, color: '#374151' }}>
                        Ngày bắt đầu <Text type="danger">*</Text>
                      </span>
                    }
                    name="startDate"
                    rules={[
                      { required: true, message: 'Vui lòng chọn ngày bắt đầu' }
                    ]}
                  >
                    <DatePicker
                      placeholder="Chọn ngày bắt đầu"
                      size="large"
                      format="DD/MM/YYYY"
                      style={{
                        width: '100%',
                        borderRadius: '8px'
                      }}
                    />
                  </Form.Item>
                </Col>

                {/* Ngày kết thúc */}
                <Col xs={24} md={24}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600, color: '#374151' }}>
                        Ngày kết thúc
                      </span>
                    }
                    name="endDate"
                  >
                    <DatePicker
                      placeholder="Chọn ngày kết thúc (không bắt buộc)"
                      size="large"
                      format="DD/MM/YYYY"
                      style={{
                        width: '100%',
                        borderRadius: '8px'
                      }}
                    />
                  </Form.Item>
                </Col>

                {/* Mô tả */}
                <Col xs={24}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600, color: '#374151' }}>
                        Mô tả
                      </span>
                    }
                    name="description"
                    rules={[
                      { max: 500, message: 'Mô tả không được quá 500 ký tự' }
                    ]}
                  >
                    <Input.TextArea
                      placeholder="Nhập mô tả gói học (không bắt buộc)"
                      rows={4}
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #d1d5db'
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: '12px',
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <Button
                  size="large"
                  onClick={handleBack}
                  style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: '8px',
                    padding: '8px 24px'
                  }}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  icon={<SaveOutlined />}
                  style={{
                    background: '#fa8c16',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 24px',
                    fontWeight: 600
                  }}
                >
                  {loading ? 'Đang tạo...' : 'Tạo gói học'}
                </Button>
              </div>
            </Form>
          </Card>
        </Space>
      </div>
    </div>
  );
};

export default CreateSubscriptionPage;


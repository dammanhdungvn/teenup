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
  TimePicker,
  Spin
} from 'antd';
import { 
  BookOutlined, 
  ArrowLeftOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { classesApi } from '../../services/classes.api.js';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const CreateClassPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const dayOfWeekOptions = [
    { value: 1, label: 'Thứ Hai' },
    { value: 2, label: 'Thứ Ba' },
    { value: 3, label: 'Thứ Tư' },
    { value: 4, label: 'Thứ Năm' },
    { value: 5, label: 'Thứ Sáu' },
    { value: 6, label: 'Thứ Bảy' },
    { value: 7, label: 'Chủ Nhật' }
  ];

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!values.name || !values.subject || !values.teacherName || !values.dayOfWeek || !values.startTime || !values.endTime) {
        message.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }
      
      // Format time values and convert maxStudents to number
      const formattedValues = {
        name: values.name.trim(),
        subject: values.subject.trim(),
        teacherName: values.teacherName.trim(),
        dayOfWeek: values.dayOfWeek,
        maxStudents: parseInt(values.maxStudents) || 1,
        timeSlot: `${values.startTime.format('HH:mm')}-${values.endTime.format('HH:mm')}`,
        description: values.description ? values.description.trim() : null
      };

  
      
      await classesApi.createClass(formattedValues);
      message.success('Tạo lớp học thành công!');
      navigate('/classes');
    } catch (error) {
      console.error('Error creating class:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Không thể tạo lớp học. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/classes');
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
                  <BookOutlined style={{ marginRight: '12px', color: '#1890ff', fontSize: '28px' }} />
                  Tạo lớp học mới
                </Title>
                <div style={{ color: '#6b7280', marginTop: '4px' }}>
                  Nhập thông tin lớp học để thêm vào hệ thống
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
              validateTrigger={['onBlur', 'onChange']}
            >
              <Row gutter={[24, 16]}>
                {/* Tên lớp */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600, color: '#374151' }}>
                        Tên lớp học <Text type="danger">*</Text>
                      </span>
                    }
                    name="name"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên lớp học' },
                      { min: 2, message: 'Tên lớp phải có ít nhất 2 ký tự' },
                      { max: 100, message: 'Tên lớp không được quá 100 ký tự' }
                    ]}
                  >
                    <Input
                      placeholder="Nhập tên lớp học"
                      size="large"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #d1d5db'
                      }}
                    />
                  </Form.Item>
                </Col>

                {/* Môn học */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600, color: '#374151' }}>
                        Môn học <Text type="danger">*</Text>
                      </span>
                    }
                    name="subject"
                    rules={[
                      { required: true, message: 'Vui lòng nhập môn học' },
                      { min: 2, message: 'Tên môn học phải có ít nhất 2 ký tự' },
                      { max: 50, message: 'Tên môn học không được quá 50 ký tự' }
                    ]}
                  >
                    <Input
                      placeholder="Nhập môn học (VD: Toán, Tiếng Anh)"
                      size="large"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #d1d5db'
                      }}
                    />
                  </Form.Item>
                </Col>

                {/* Tên giáo viên */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600, color: '#374151' }}>
                        Tên giáo viên <Text type="danger">*</Text>
                      </span>
                    }
                    name="teacherName"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên giáo viên' },
                      { min: 2, message: 'Tên giáo viên phải có ít nhất 2 ký tự' },
                      { max: 100, message: 'Tên giáo viên không được quá 100 ký tự' }
                    ]}
                  >
                    <Input
                      placeholder="Nhập tên giáo viên"
                      size="large"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #d1d5db'
                      }}
                    />
                  </Form.Item>
                </Col>

                {/* Thứ trong tuần */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600, color: '#374151' }}>
                        Thứ trong tuần <Text type="danger">*</Text>
                      </span>
                    }
                    name="dayOfWeek"
                    rules={[
                      { required: true, message: 'Vui lòng chọn thứ trong tuần' }
                    ]}
                  >
                    <Select
                      placeholder="Chọn thứ trong tuần"
                      size="large"
                      style={{
                        borderRadius: '8px'
                      }}
                    >
                      {dayOfWeekOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* Số lượng học sinh tối đa */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600, color: '#374151' }}>
                        Số lượng học sinh tối đa <Text type="danger">*</Text>
                      </span>
                    }
                    name="maxStudents"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số lượng học sinh tối đa' },
                      {
                        validator: (_, value) => {
                          if (!value || value === '') {
                            return Promise.reject(new Error('Vui lòng nhập số lượng học sinh tối đa'));
                          }
                          const numValue = parseInt(value);
                          if (isNaN(numValue)) {
                            return Promise.reject(new Error('Số lượng phải là số'));
                          }
                          if (numValue < 1) {
                            return Promise.reject(new Error('Số lượng phải lớn hơn 0'));
                          }
                          if (numValue > 50) {
                            return Promise.reject(new Error('Số lượng không được quá 50'));
                          }
                          return Promise.resolve();
                        }
                      }
                    ]}
                  >
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      placeholder="Nhập số lượng tối đa (1-50)"
                      size="large"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #d1d5db'
                      }}
                    />
                  </Form.Item>
                </Col>

                {/* Thời gian bắt đầu */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600, color: '#374151' }}>
                        Thời gian bắt đầu <Text type="danger">*</Text>
                      </span>
                    }
                    name="startTime"
                    rules={[
                      { required: true, message: 'Vui lòng chọn thời gian bắt đầu' }
                    ]}
                  >
                    <TimePicker
                      format="HH:mm"
                      placeholder="Chọn giờ bắt đầu"
                      size="large"
                      minuteStep={15}
                      style={{
                        width: '100%',
                        borderRadius: '8px'
                      }}
                    />
                  </Form.Item>
                </Col>

                {/* Thời gian kết thúc */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600, color: '#374151' }}>
                        Thời gian kết thúc <Text type="danger">*</Text>
                      </span>
                    }
                    name="endTime"
                    dependencies={['startTime']}
                    rules={[
                      { required: true, message: 'Vui lòng chọn thời gian kết thúc' },
                      {
                        validator: (_, value) => {
                          const startTime = form.getFieldValue('startTime');
                          if (startTime && value && value.isBefore(startTime)) {
                            return Promise.reject(new Error('Thời gian kết thúc phải sau thời gian bắt đầu'));
                          }
                          return Promise.resolve();
                        }
                      }
                    ]}
                  >
                    <TimePicker
                      format="HH:mm"
                      placeholder="Chọn giờ kết thúc"
                      size="large"
                      minuteStep={15}
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
                      placeholder="Nhập mô tả lớp học (không bắt buộc)"
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
                    background: '#1890ff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 24px',
                    fontWeight: 600
                  }}
                >
                  {loading ? 'Đang tạo...' : 'Tạo lớp học'}
                </Button>
              </div>
            </Form>
          </Card>
        </Space>
      </div>
    </div>
  );
};

export default CreateClassPage;


import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Space, 
  Typography, 
  App,
  Spin,
  Select,
  TimePicker,
  Row,
  Col
} from 'antd';
import { 
  BookOutlined, 
  ArrowLeftOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { classesApi } from '../../services/classes.api.js';
import { getDayOfWeekLabel } from '../../utils/validation.js';
import { handleError } from '../../utils/errorHandler.js';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const EditClassPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [classData, setClassData] = useState(null);

  useEffect(() => {
    fetchClass();
  }, [id]);

  const fetchClass = async () => {
    try {
      setLoading(true);
      const response = await classesApi.getClassById(id);
      setClassData(response.data);
      
      // Set form values
      form.setFieldsValue({
        name: response.data.name,
        subject: response.data.subject,
        dayOfWeek: response.data.dayOfWeek,
        startTime: dayjs(response.data.startTime, 'HH:mm'),
        endTime: dayjs(response.data.endTime, 'HH:mm'),
        maxStudents: response.data.maxStudents,
        description: response.data.description
      });
    } catch (error) {
      handleError(error, message, 'Không thể tải thông tin lớp học', 'fetchClass');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setSaving(true);
      
      const classData = {
        name: values.name,
        subject: values.subject,
        dayOfWeek: values.dayOfWeek,
        startTime: values.startTime.format('HH:mm'),
        endTime: values.endTime.format('HH:mm'),
        maxStudents: parseInt(values.maxStudents),
        description: values.description
      };

      await classesApi.updateClass(id, classData);
      message.success('Cập nhật lớp học thành công');
      navigate(`/classes/${id}`);
    } catch (error) {
      handleError(error, message, 'Không thể cập nhật lớp học', 'onFinish');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate(`/classes/${id}`);
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
            Đang tải thông tin lớp học...
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
                  <BookOutlined style={{ marginRight: '12px', color: '#1890ff', fontSize: '28px' }} />
                  Chỉnh sửa lớp học
                </Title>
                <div style={{ color: '#6b7280', marginTop: '4px' }}>
                  Cập nhật thông tin lớp học: {classData?.name}
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
                    label="Tên lớp học"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên lớp học' },
                      { min: 2, message: 'Tên lớp học phải có ít nhất 2 ký tự' }
                    ]}
                  >
                    <Input 
                      placeholder="Nhập tên lớp học"
                      size="large"
                      prefix={<BookOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="subject"
                    label="Môn học"
                    rules={[
                      { required: true, message: 'Vui lòng chọn môn học' }
                    ]}
                  >
                    <Select
                      placeholder="Chọn môn học"
                      size="large"
                      showSearch
                      optionFilterProp="children"
                    >
                      <Option value="MATH">Toán học</Option>
                      <Option value="LITERATURE">Văn học</Option>
                      <Option value="ENGLISH">Tiếng Anh</Option>
                      <Option value="PHYSICS">Vật lý</Option>
                      <Option value="CHEMISTRY">Hóa học</Option>
                      <Option value="BIOLOGY">Sinh học</Option>
                      <Option value="HISTORY">Lịch sử</Option>
                      <Option value="GEOGRAPHY">Địa lý</Option>
                      <Option value="CIVICS">Giáo dục công dân</Option>
                      <Option value="TECHNOLOGY">Công nghệ</Option>
                      <Option value="PHYSICAL_EDUCATION">Thể dục</Option>
                      <Option value="ART">Mỹ thuật</Option>
                      <Option value="MUSIC">Âm nhạc</Option>
                      <Option value="OTHER">Khác</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="dayOfWeek"
                    label="Thứ trong tuần"
                    rules={[
                      { required: true, message: 'Vui lòng chọn thứ trong tuần' }
                    ]}
                  >
                    <Select
                      placeholder="Chọn thứ"
                      size="large"
                    >
                      <Option value="MONDAY">Thứ 2</Option>
                      <Option value="TUESDAY">Thứ 3</Option>
                      <Option value="WEDNESDAY">Thứ 4</Option>
                      <Option value="THURSDAY">Thứ 5</Option>
                      <Option value="FRIDAY">Thứ 6</Option>
                      <Option value="SATURDAY">Thứ 7</Option>
                      <Option value="SUNDAY">Chủ nhật</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="startTime"
                    label="Giờ bắt đầu"
                    rules={[
                      { required: true, message: 'Vui lòng chọn giờ bắt đầu' }
                    ]}
                  >
                    <TimePicker
                      format="HH:mm"
                      minuteStep={15}
                      size="large"
                      style={{ width: '100%' }}
                      placeholder="Chọn giờ bắt đầu"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="endTime"
                    label="Giờ kết thúc"
                    rules={[
                      { required: true, message: 'Vui lòng chọn giờ kết thúc' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const startTime = getFieldValue('startTime');
                          if (!value || !startTime) {
                            return Promise.resolve();
                          }
                          if (value.isSame(startTime) || value.isBefore(startTime)) {
                            return Promise.reject(new Error('Giờ kết thúc phải sau giờ bắt đầu'));
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <TimePicker
                      format="HH:mm"
                      minuteStep={15}
                      size="large"
                      style={{ width: '100%' }}
                      placeholder="Chọn giờ kết thúc"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="maxStudents"
                    label="Số lượng học sinh tối đa"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số lượng học sinh tối đa' },
                      {
                        validator: (_, value) => {
                          const numValue = parseInt(value);
                          if (isNaN(numValue) || numValue <= 0) {
                            return Promise.reject('Số lượng phải lớn hơn 0');
                          }
                          if (numValue > 50) {
                            return Promise.reject('Số lượng không được quá 50');
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
                      placeholder="Nhập số lượng học sinh tối đa"
                      size="large"
                      prefix={<BookOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="description"
                    label="Mô tả"
                  >
                    <Input.TextArea
                      placeholder="Nhập mô tả lớp học (không bắt buộc)"
                      size="large"
                      rows={4}
                      showCount
                      maxLength={500}
                    />
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
                      background: '#1890ff',
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

export default EditClassPage;

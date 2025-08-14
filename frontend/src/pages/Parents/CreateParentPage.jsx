import React, { useState } from 'react';
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
  message
} from 'antd';
import { 
  TeamOutlined, 
  ArrowLeftOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { parentsApi } from '../../services/parents.api.js';

const { Title, Text } = Typography;

const CreateParentPage = () => {
  const { message: antMessage } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await parentsApi.createParent(values);
      antMessage.success('Thêm phụ huynh thành công!');
      navigate('/parents');
    } catch (error) {
      console.error('Error creating parent:', error);
      if (error.response?.data?.message) {
        antMessage.error(error.response.data.message);
      } else {
        antMessage.error('Không thể thêm phụ huynh. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/parents');
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
                  <TeamOutlined style={{ marginRight: '12px', color: '#52c41a', fontSize: '28px' }} />
                  Thêm phụ huynh mới
                </Title>
                <div style={{ color: '#6b7280', marginTop: '4px' }}>
                  Nhập thông tin phụ huynh để thêm vào hệ thống
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
                {/* Họ và tên */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600, color: '#374151' }}>
                        Họ và tên <Text type="danger">*</Text>
                      </span>
                    }
                    name="name"
                    rules={[
                      { required: true, message: 'Vui lòng nhập họ và tên phụ huynh' },
                      { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự' },
                      { max: 100, message: 'Họ và tên không được quá 100 ký tự' }
                    ]}
                  >
                    <Input
                      placeholder="Nhập họ và tên phụ huynh"
                      size="large"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #d1d5db'
                      }}
                    />
                  </Form.Item>
                </Col>

                {/* Số điện thoại */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600, color: '#374151' }}>
                        Số điện thoại <Text type="danger">*</Text>
                      </span>
                    }
                    name="phone"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số điện thoại' },
                      { 
                        pattern: /^[0-9+\-\s()]+$/, 
                        message: 'Số điện thoại không hợp lệ' 
                      },
                      { min: 10, message: 'Số điện thoại phải có ít nhất 10 số' },
                      { max: 15, message: 'Số điện thoại không được quá 15 số' }
                    ]}
                  >
                    <Input
                      placeholder="Nhập số điện thoại"
                      size="large"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #d1d5db'
                      }}
                    />
                  </Form.Item>
                </Col>

                {/* Email */}
                <Col xs={24}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600, color: '#374151' }}>
                        Email <Text type="danger">*</Text>
                      </span>
                    }
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' },
                      { max: 100, message: 'Email không được quá 100 ký tự' }
                    ]}
                  >
                    <Input
                      placeholder="Nhập email phụ huynh"
                      size="large"
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
                    background: '#52c41a',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 24px',
                    fontWeight: 600
                  }}
                >
                  {loading ? 'Đang thêm...' : 'Thêm phụ huynh'}
                </Button>
              </div>
            </Form>
          </Card>
        </Space>
      </div>
    </div>
  );
};

export default CreateParentPage;

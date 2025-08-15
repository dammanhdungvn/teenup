import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Space, 
  Typography, 
  App,
  Spin
} from 'antd';
import { 
  TeamOutlined, 
  ArrowLeftOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { parentsApi } from '../../services/parents.api.js';
import { handleError } from '../../utils/errorHandler.js';

const { Title } = Typography;

const EditParentPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parent, setParent] = useState(null);

  useEffect(() => {
    fetchParent();
  }, [id]);

  const fetchParent = async () => {
    try {
      setLoading(true);
      const response = await parentsApi.getParentById(id);
      setParent(response.data);
      
      // Set form values
      form.setFieldsValue({
        name: response.data.name,
        phone: response.data.phone,
        email: response.data.email
      });
    } catch (error) {
      handleError(error, message, 'Không thể tải thông tin phụ huynh', 'fetchParent');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setSaving(true);
      
      const parentData = {
        name: values.name,
        phone: values.phone,
        email: values.email
      };

      await parentsApi.updateParent(id, parentData);
      message.success('Cập nhật phụ huynh thành công');
      navigate(`/parents/${id}`);
    } catch (error) {
      handleError(error, message, 'Không thể cập nhật phụ huynh', 'onFinish');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate(`/parents/${id}`);
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
            Đang tải thông tin phụ huynh...
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
                  <TeamOutlined style={{ marginRight: '12px', color: '#52c41a', fontSize: '28px' }} />
                  Chỉnh sửa phụ huynh
                </Title>
                <div style={{ color: '#6b7280', marginTop: '4px' }}>
                  Cập nhật thông tin phụ huynh: {parent?.name}
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
              style={{ maxWidth: '600px', margin: '0 auto' }}
            >
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên' },
                  { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự' }
                ]}
              >
                <Input 
                  placeholder="Nhập họ và tên phụ huynh"
                  size="large"
                  prefix={<TeamOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                ]}
              >
                <Input 
                  placeholder="Nhập số điện thoại"
                  size="large"
                  prefix={<TeamOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input 
                  placeholder="Nhập email"
                  size="large"
                  prefix={<TeamOutlined />}
                />
              </Form.Item>

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

export default EditParentPage;

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
  Modal
} from 'antd';
import { 
  TeamOutlined, 
  PlusOutlined, 
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { parentsApi } from '../../services/parents.api.js';
import { formatDate } from '../../utils/validation.js';

const { Title } = Typography;

const ParentsListPage = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [parentToDelete, setParentToDelete] = useState(null);
  const navigate = useNavigate();
  const { message } = App.useApp();

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      setLoading(true);
      const response = await parentsApi.getParentsList();
      setParents(response.data);
    } catch (error) {
      console.error('Error fetching parents:', error);
      const backendMessage = error?.response?.data?.message;
      if (backendMessage) {
        message.error(backendMessage);
      } else {
        message.error('Không thể tải danh sách phụ huynh');
      }
    } finally {
      setLoading(false);
    }
  };

  const showDeleteModal = (parent) => {
    setParentToDelete(parent);
    setDeleteModalVisible(true);
  };

  const handleDeleteParent = async () => {
    if (!parentToDelete) return;
    
    try {
      await parentsApi.deleteParent(parentToDelete.id);
      message.success('Xóa phụ huynh thành công!');
      fetchParents(); // Refresh danh sách
      setDeleteModalVisible(false);
      setParentToDelete(null);
    } catch (err) {
      console.error('Error deleting parent:', err);
      const backendMessage = err?.response?.data?.message;
      if (backendMessage) {
        message.error(backendMessage);
      } else {
        message.error('Không thể xóa phụ huynh');
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setParentToDelete(null);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: { xs: 80, sm: 100, md: 100 },
      align: 'center',
      fixed: { xs: false, sm: false, md: 'left' },
      responsive: ['md'],
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
      width: { xs: 200, sm: 280, md: 350 },
      render: (name) => (
        <Space size="middle">
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#52c41a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            boxShadow: '0 2px 8px rgba(82, 196, 26, 0.2)'
          }}>
            <TeamOutlined />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#1f2937', fontSize: '16px' }}>
              {name}
            </div>
            <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '2px' }}>
              Phụ huynh
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: { xs: 150, sm: 180, md: 200 },
      align: 'center',
      responsive: ['md'],
      render: (phone) => (
        <Tag 
          color="green" 
          style={{ 
            fontWeight: 600,
            padding: { xs: '6px 12px', sm: '7px 14px', md: '8px 16px' },
            borderRadius: '10px',
            fontSize: { xs: '12px', sm: '13px', md: '14px' },
            minWidth: { xs: '80px', sm: '90px', md: '100px' },
            fontFamily: 'monospace'
          }}
        >
          {phone}
        </Tag>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: { xs: 200, sm: 250, md: 300 },
      align: 'center',
      responsive: ['md'],
      render: (email) => (
        <Tag 
          color="purple" 
          style={{ 
            fontWeight: 600,
            padding: { xs: '6px 12px', sm: '7px 14px', md: '8px 16px' },
            borderRadius: '10px',
            fontSize: { xs: '12px', sm: '13px', md: '14px' },
            minWidth: { xs: '120px', sm: '140px', md: '160px' },
            fontFamily: 'monospace'
          }}
        >
          {email}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: { xs: 180, sm: 200, md: 250 },
      align: 'center',
      fixed: { xs: false, sm: false, md: 'right' },
      render: (_, record) => (
        <Space size={{ xs: 'small', sm: 'middle' }} direction={{ xs: 'vertical', sm: 'horizontal' }}>
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/parents/${record.id}`)}
              size={{ xs: 'small', sm: 'middle' }}
              style={{
                background: '#1890ff',
                border: 'none',
                borderRadius: '8px',
                padding: { xs: '6px 12px', sm: '8px 16px' },
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.2)',
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              {window.innerWidth < 768 ? 'Xem' : 'Xem'}
            </Button>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => navigate(`/parents/${record.id}/edit`)}
              size={{ xs: 'small', sm: 'middle' }}
              style={{
                border: '2px solid #52c41a',
                color: '#52c41a',
                borderRadius: '8px',
                padding: { xs: '6px 12px', sm: '8px 16px' },
                fontWeight: 600,
                background: 'transparent',
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              {window.innerWidth < 768 ? 'Sửa' : 'Sửa'}
            </Button>
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => showDeleteModal(record)}
              size={{ xs: 'small', sm: 'middle' }}
              style={{
                borderRadius: '8px',
                padding: { xs: '6px 12px', sm: '8px 16px' },
                fontWeight: 600,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              {window.innerWidth < 768 ? 'Xóa' : 'Xóa'}
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleAddNew = () => {
    navigate('/parents/new');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải danh sách phụ huynh...</div>
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
                  <TeamOutlined style={{ marginRight: '12px', color: '#52c41a', fontSize: '28px' }} />
                  Danh sách phụ huynh
                </Title>
                <div style={{ color: '#6b7280', marginTop: '4px' }}>
                  Quản lý thông tin phụ huynh và liên hệ
                </div>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={handleAddNew}
                style={{
                  background: '#52c41a',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(82, 196, 26, 0.2)',
                  fontWeight: 600,
                  borderRadius: '8px'
                }}
              >
                Thêm phụ huynh mới
              </Button>
            </div>
          </Card>

          {/* Table */}
          <Card style={{ 
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            padding: '0',
            overflow: 'auto'
          }}>
            <Table
              columns={columns}
              dataSource={parents}
              rowKey="id"
              pagination={false}
              loading={loading}
              locale={{
                emptyText: (
                  <div style={{ textAlign: 'center', padding: '60px' }}>
                    <TeamOutlined style={{ fontSize: '64px', color: '#d1d5db', marginBottom: '24px' }} />
                    <div style={{ color: '#6b7280', fontSize: '16px' }}>Chưa có phụ huynh nào</div>
                  </div>
                ),
              }}
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                width: '100%'
              }}
              size="large"
              scroll={{ x: { xs: 800, sm: 1000, md: 'max-content' } }}
              responsive={true}
            />
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
                Tổng cộng {parents.length} phụ huynh
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
                <span style={{ color: '#6b7280', fontSize: '14px' }}>phụ huynh/trang</span>
              </div>
            </div>
          </Card>
        </Space>

        {/* Delete Confirmation Modal */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DeleteOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
              <span>Xác nhận xóa phụ huynh</span>
            </div>
          }
          open={deleteModalVisible}
          onOk={handleDeleteParent}
          onCancel={handleCancelDelete}
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
          centered
        >
          <div style={{ padding: '16px 0' }}>
            <p style={{ marginBottom: '16px', fontSize: '16px', color: '#1f2937' }}>
              Bạn có chắc chắn muốn xóa phụ huynh này không?
            </p>
            {parentToDelete && (
              <div style={{ 
                background: '#f8f9fa', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>
                  Thông tin phụ huynh:
                </div>
                <div style={{ color: '#6b7280' }}>
                  <div><strong>ID:</strong> {parentToDelete.id}</div>
                  <div><strong>Họ và tên:</strong> {parentToDelete.name}</div>
                  <div><strong>Số điện thoại:</strong> {parentToDelete.phone}</div>
                  <div><strong>Email:</strong> {parentToDelete.email}</div>
                </div>
              </div>
            )}
            <div style={{ 
              marginTop: '16px', 
              padding: '12px 16px', 
              background: '#fff2e8', 
              border: '1px solid #ffd591',
              borderRadius: '6px',
              color: '#d46b08'
            }}>
              <strong>⚠️ Lưu ý:</strong> Hành động này không thể hoàn tác. 
              Tất cả học sinh liên quan sẽ bị ảnh hưởng.
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ParentsListPage;

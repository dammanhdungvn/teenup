import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Input, 
  Select, 
  DatePicker, 
  message, 
  Spin,
  Tooltip,
  Modal,
  Descriptions,
  Badge,
  Typography,
  Form
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  ReloadOutlined, 
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  GiftOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { App } from 'antd';
import dayjs from 'dayjs';
import { subscriptionsApi } from '../../services/subscriptions.api.js';
import { studentsApi } from '../../services/students.api.js';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Title } = Typography;

const SubscriptionsListPage = () => {
  const { message: messageApi } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);


  // State cho modal xem chi tiết
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  // State cho modal edit và delete
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [deletingSubscription, setDeletingSubscription] = useState(null);

  // Fetch subscriptions
  const fetchSubscriptions = async (params = {}) => {
    try {
      setLoading(true);
      const resp = await subscriptionsApi.getSubscriptionsList();
      
      if (resp.data && Array.isArray(resp.data)) {
        setSubscriptions(resp.data);
      } else {
        setSubscriptions([]);
      }
    } catch (err) {
      messageApi.error('Không thể tải danh sách gói học');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch students để hiển thị tên
  const fetchStudents = async () => {
    try {
      const resp = await studentsApi.getStudentsList();
      if (resp.data && Array.isArray(resp.data)) {
        setStudents(resp.data);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchStudents();
  }, []);

  // Xử lý tìm kiếm và lọc
  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleRefresh = () => {
    fetchSubscriptions();
    setSearchText('');
    setStatusFilter('all');
    setDateRange(null);
  };

  // Lọc dữ liệu
  const filteredSubscriptions = subscriptions.filter(subscription => {
    const student = students.find(s => s.id === subscription.studentId);
    const studentName = student ? student.name : '';
    const packageName = subscription.packageName || '';
    
    // Lọc theo text search
    if (searchText && !`${studentName} ${packageName}`.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    
    // Lọc theo status
    if (statusFilter !== 'all') {
      if (statusFilter === 'active' && subscription.remainingSessions <= 0) return false;
      if (statusFilter === 'expired' && subscription.endDate && dayjs(subscription.endDate).isBefore(dayjs(), 'day')) return false;
      if (statusFilter === 'upcoming' && subscription.startDate && dayjs(subscription.startDate).isAfter(dayjs(), 'day')) return false;
    }
    
    // Lọc theo date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dayjs(subscription.startDate);
      const endDate = dayjs(subscription.endDate);
      const rangeStart = dateRange[0];
      const rangeEnd = dateRange[1];
      
      if (!startDate.isBetween(rangeStart, rangeEnd, 'day', '[]') && 
          !endDate.isBetween(rangeStart, rangeEnd, 'day', '[]')) {
        return false;
      }
    }
    
    return true;
  });



  // Xem chi tiết subscription
  const handleViewDetail = (subscription) => {
    setSelectedSubscription(subscription);
    setDetailModalVisible(true);
  };

  // Đóng modal chi tiết
  const handleCloseDetail = () => {
    setDetailModalVisible(false);
    setSelectedSubscription(null);
  };

  // Xử lý edit subscription
  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
    setEditModalVisible(true);
  };

  // Xử lý delete subscription
  const handleDelete = (subscription) => {
    setDeletingSubscription(subscription);
    setDeleteModalVisible(true);
  };

  // Xác nhận delete
  const confirmDelete = async () => {
    if (!deletingSubscription) return;
    
    try {
      await subscriptionsApi.deleteSubscription(deletingSubscription.id);
      messageApi.success('Đã xóa gói học thành công!');
      setDeleteModalVisible(false);
      setDeletingSubscription(null);
      fetchSubscriptions(); // Refresh data
    } catch (err) {
      const backendMessage = err?.response?.data?.message;
      if (backendMessage) {
        messageApi.error(backendMessage);
      } else {
        messageApi.error('Không thể xóa gói học');
      }
    }
  };

  // Hủy delete
  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setDeletingSubscription(null);
  };

  // Sử dụng 1 buổi học
  const handleUseSession = async (subscriptionId) => {
    try {
      await subscriptionsApi.useSession(subscriptionId);
      messageApi.success('Đã sử dụng 1 buổi học thành công!');
      fetchSubscriptions(); // Refresh data
      if (selectedSubscription && selectedSubscription.id === subscriptionId) {
        setSelectedSubscription(prev => ({
          ...prev,
          usedSessions: prev.usedSessions + 1,
          remainingSessions: prev.remainingSessions - 1
        }));
      }
    } catch (err) {
      const code = err?.response?.data?.code;
      if (code === 'SUBSCRIPTION_INACTIVE') {
        messageApi.error('Gói học chưa đến ngày bắt đầu hoặc đã quá hạn');
      } else if (code === 'NO_REMAINING_SESSIONS') {
        messageApi.error('Gói học đã hết số buổi');
      } else {
        messageApi.error('Không thể sử dụng buổi học. Vui lòng thử lại.');
      }
    }
  };

  // Columns cho table
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
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
      title: 'Tên gói',
      dataIndex: 'packageName',
      key: 'packageName',
      width: 180,
      render: (name) => (
        <Space size="middle">
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px',
            boxShadow: '0 2px 8px rgba(250, 140, 22, 0.3)'
          }}>
            <GiftOutlined style={{ fontSize: '20px', color: 'white' }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '16px', marginBottom: '4px' }}>
              {name}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: 'Học sinh',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 180,
      render: (studentId) => {
        const student = students.find(s => s.id === studentId);
        return (
          <Space size="middle">
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
            }}>
              <UserOutlined style={{ fontSize: '18px', color: 'white' }} />
            </div>
            <div>
              <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '14px', marginBottom: '2px' }}>
                {student ? student.name : `ID: ${studentId}`}
              </div>
            </div>
          </Space>
        );
      }
    },
    {
      title: 'Thời gian',
      key: 'dateRange',
      width: 160,
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#374151', marginBottom: '4px', fontWeight: 500 }}>
            <CalendarOutlined style={{ marginRight: '6px', color: '#1890ff' }} />
            Từ: {dayjs(record.startDate).format('DD/MM/YYYY')}
          </div>
          {record.endDate && (
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              Đến: {dayjs(record.endDate).format('DD/MM/YYYY')}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Số buổi học',
      key: 'sessions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#059669', marginBottom: '4px' }}>
            {record.remainingSessions}/{record.totalSessions}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Còn lại: {record.remainingSessions}
          </div>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 100,
      align: 'center',
      render: (_, record) => {
        let status = 'active';
        let color = 'success';
        let text = 'Hoạt động';
        
        if (record.remainingSessions <= 0) {
          status = 'completed';
          color = 'default';
          text = 'Đã hết';
        } else if (record.endDate && dayjs(record.endDate).isBefore(dayjs(), 'day')) {
          status = 'expired';
          color = 'error';
          text = 'Hết hạn';
        } else if (record.startDate && dayjs(record.startDate).isAfter(dayjs(), 'day')) {
          status = 'upcoming';
          color = 'processing';
          text = 'Sắp tới';
        }
        
        return (
          <Tag 
            color={color} 
            style={{ 
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px'
            }}
          >
            {text}
          </Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 180,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
              style={{ 
                color: '#1890ff',
                borderRadius: '6px',
                height: '32px',
                width: '32px'
              }}
            />
          </Tooltip>
          
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ 
                color: '#fa8c16',
                borderRadius: '6px',
                height: '32px',
                width: '32px'
              }}
            />
          </Tooltip>

          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              style={{ 
                borderRadius: '6px',
                height: '32px',
                width: '32px'
              }}
            />
          </Tooltip>

          {record.remainingSessions > 0 && (
            <Tooltip title="Sử dụng 1 buổi học">
              <Button
                type="primary"
                size="small"
                onClick={() => handleUseSession(record.id)}
                style={{
                  background: '#52c41a',
                  border: 'none',
                  borderRadius: '6px',
                  height: '32px',
                  fontWeight: 500
                }}
              >
                Dùng buổi
              </Button>
            </Tooltip>
          )}
        </Space>
      )
    }
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
                  <GiftOutlined style={{ marginRight: '12px', color: '#fa8c16', fontSize: '28px' }} />
                  Danh sách gói học
                </Title>
                <div style={{ color: '#6b7280', marginTop: '4px' }}>
                  Quản lý và theo dõi các gói học của học sinh
                </div>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => navigate('/subscriptions/new')}
                style={{
                  background: '#fa8c16',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(250, 140, 22, 0.2)',
                  fontWeight: 600,
                  borderRadius: '8px'
                }}
              >
                Tạo gói học mới
              </Button>
            </div>
          </Card>

          {/* Filters */}
          <Card style={{ 
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Search
                placeholder="Tìm kiếm theo tên gói hoặc học sinh..."
                allowClear
                style={{ width: 300 }}
                onSearch={handleSearch}
                onChange={(e) => setSearchText(e.target.value)}
              />
              
              <Select
                placeholder="Lọc theo trạng thái"
                style={{ width: 150 }}
                value={statusFilter}
                onChange={handleStatusFilter}
                options={[
                  { label: 'Tất cả', value: 'all' },
                  { label: 'Hoạt động', value: 'active' },
                  { label: 'Đã hết', value: 'completed' },
                  { label: 'Hết hạn', value: 'expired' },
                  { label: 'Sắp tới', value: 'upcoming' }
                ]}
              />
              
              <RangePicker
                placeholder={['Từ ngày', 'Đến ngày']}
                style={{ width: 250 }}
                value={dateRange}
                onChange={handleDateRangeChange}
                format="DD/MM/YYYY"
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
                dataSource={filteredSubscriptions}
                rowKey="id"
                pagination={false}
                loading={loading}
                locale={{
                  emptyText: (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                      <GiftOutlined style={{ fontSize: '64px', color: '#d1d5db', marginBottom: '24px' }} />
                      <div style={{ color: '#6b7280', fontSize: '16px' }}>Chưa có gói học nào</div>
                    </div>
                  ),
                }}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  minWidth: '980px'
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
                Tổng cộng {filteredSubscriptions.length} gói học
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
                <span style={{ color: '#6b7280', fontSize: '14px' }}>gói học/trang</span>
              </div>
            </div>
          </Card>
        </Space>
      </div>

      {/* Edit Subscription Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <EditOutlined style={{ color: '#fa8c16', fontSize: '20px' }} />
            <span>Chỉnh sửa gói học</span>
          </div>
        }
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
        centered
      >
        {editingSubscription && (
          <div style={{ padding: '16px 0' }}>
            <p style={{ marginBottom: '16px', color: '#6b7280' }}>
              Gói học: <strong>{editingSubscription.packageName}</strong><br/>
              Học sinh: <strong>{students.find(s => s.id === editingSubscription.studentId)?.name}</strong>
            </p>
            <p style={{ color: '#fa8c16', fontSize: '14px' }}>
              ⚠️ Chức năng chỉnh sửa gói học sẽ được implement trong Task 8
            </p>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Button onClick={() => setEditModalVisible(false)}>
                Đóng
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DeleteOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
            <span>Xác nhận xóa gói học</span>
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
          <p>Bạn có chắc chắn muốn xóa gói học <strong>"{deletingSubscription?.packageName}"</strong> của học sinh <strong>"{students.find(s => s.id === deletingSubscription?.studentId)?.name}"</strong>?</p>
          <p style={{ color: '#ff4d4f', fontSize: '14px' }}>
            Hành động này không thể hoàn tác!
          </p>
        </div>
      </Modal>

      {/* Modal chi tiết subscription */}
      <Modal
        title={
          <div style={{ textAlign: 'center' }}>
            <GiftOutlined style={{ marginRight: '8px', color: '#fa8c16' }} />
            Chi tiết gói học
          </div>
        }
        open={detailModalVisible}
        onCancel={handleCloseDetail}
        footer={[
          <Button key="close" onClick={handleCloseDetail}>
            Đóng
          </Button>
        ]}
        width={600}
        centered
      >
        {selectedSubscription && (
          <div>
            <Card size="small" style={{ marginBottom: '16px', background: '#f8fafc' }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Tên gói">
                  <strong>{selectedSubscription.packageName}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Học sinh">
                  {students.find(s => s.id === selectedSubscription.studentId)?.name || `ID: ${selectedSubscription.studentId}`}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày bắt đầu">
                  {dayjs(selectedSubscription.startDate).format('DD/MM/YYYY')}
                </Descriptions.Item>
                {selectedSubscription.endDate && (
                  <Descriptions.Item label="Ngày kết thúc">
                    {dayjs(selectedSubscription.endDate).format('DD/MM/YYYY')}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Tổng số buổi">
                  {selectedSubscription.totalSessions}
                </Descriptions.Item>
                <Descriptions.Item label="Đã sử dụng">
                  {selectedSubscription.usedSessions}
                </Descriptions.Item>
                <Descriptions.Item label="Còn lại">
                  <Tag color="success">{selectedSubscription.remainingSessions}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
            
            {selectedSubscription.remainingSessions > 0 && (
              <div style={{ textAlign: 'center' }}>
                <Button
                  type="primary"
                  icon={<CalendarOutlined />}
                  onClick={() => handleUseSession(selectedSubscription.id)}
                  style={{
                    background: '#52c41a',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  Sử dụng 1 buổi học
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubscriptionsListPage;

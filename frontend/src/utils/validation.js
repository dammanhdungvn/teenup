// Validation helpers
export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};

export const validateDate = (date) => {
  if (!date) return false;
  const selectedDate = new Date(date);
  const today = new Date();
  return selectedDate <= today;
};

// Format helpers
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

export const formatTimeSlot = (timeSlot) => {
  if (!timeSlot) return '';
  // Format: "14:00-15:30" → "14:00 - 15:30"
  return timeSlot.replace('-', ' - ');
};

// Gender options
export const GENDER_OPTIONS = [
  { label: 'Nam', value: 'M' },
  { label: 'Nữ', value: 'F' },
  { label: 'Khác', value: 'O' },
];

// Grade options for dropdown
// Hiển thị tiếng Việt cho user, lưu tiếng Anh vào database
export const GRADE_OPTIONS = [
  { label: 'Lớp 1', value: 'Grade 1' },
  { label: 'Lớp 2', value: 'Grade 2' },
  { label: 'Lớp 3', value: 'Grade 3' },
  { label: 'Lớp 4', value: 'Grade 4' },
  { label: 'Lớp 5', value: 'Grade 5' },
  { label: 'Lớp 6', value: 'Grade 6' },
  { label: 'Lớp 7', value: 'Grade 7' },
  { label: 'Lớp 8', value: 'Grade 8' },
  { label: 'Lớp 9', value: 'Grade 9' },
  { label: 'Lớp 10', value: 'Grade 10' },
  { label: 'Lớp 11', value: 'Grade 11' },
  { label: 'Lớp 12', value: 'Grade 12' },
];

// Day of week mapping
export const DAY_OF_WEEK_MAP = {
  1: 'Thứ Hai',
  2: 'Thứ Ba',
  3: 'Thứ Tư',
  4: 'Thứ Năm',
  5: 'Thứ Sáu',
  6: 'Thứ Bảy',
  7: 'Chủ Nhật',
};

// Helper function to get day label
export const getDayOfWeekLabel = (dayOfWeek) => {
  return DAY_OF_WEEK_MAP[dayOfWeek] || `Thứ ${dayOfWeek}`;
};

// Error message mapping
export const ERROR_MESSAGE_MAP = {
  ALREADY_REGISTERED: 'Học sinh đã đăng ký lớp này',
  CLASS_FULL: 'Lớp đã đủ số lượng học sinh',
  SCHEDULE_CONFLICT: 'Trùng lịch với lớp khác',
  CLASS_NOT_FOUND: 'Không tìm thấy lớp',
  STUDENT_NOT_FOUND: 'Không tìm thấy học sinh',
  PARENT_NOT_FOUND: 'Không tìm thấy phụ huynh',
  SUBSCRIPTION_NOT_FOUND: 'Không tìm thấy gói học',
  SUBSCRIPTION_INACTIVE: 'Gói học không hoạt động',
  NO_REMAINING_SESSIONS: 'Đã hết số buổi học',
};

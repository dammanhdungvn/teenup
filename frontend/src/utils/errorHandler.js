/**
 * Error Handler Utility
 * 
 * Xử lý error messages từ backend API một cách nhất quán
 */

/**
 * Lấy message lỗi từ error response
 * @param {Error} error - Error object từ catch block
 * @param {string} fallbackMessage - Message mặc định nếu không có backend message
 * @returns {string} Message lỗi để hiển thị
 */
export const getErrorMessage = (error, fallbackMessage = 'Có lỗi xảy ra') => {
  // Kiểm tra backend message trước (ưu tiên cao nhất)
  const backendMessage = error?.response?.data?.message;
  if (backendMessage) {
    return backendMessage;
  }

  // Kiểm tra error code từ backend
  const backendCode = error?.response?.data?.code;
  if (backendCode) {
    // Map các error code phổ biến
    const errorCodeMap = {
      'VALIDATION_FAILED': 'Dữ liệu không hợp lệ',
      'NOT_FOUND': 'Không tìm thấy dữ liệu',
      'CONFLICT': 'Dữ liệu bị xung đột',
      'UNAUTHORIZED': 'Không có quyền truy cập',
      'FORBIDDEN': 'Bị cấm truy cập',
      'METHOD_NOT_ALLOWED': 'Phương thức không được hỗ trợ',
      'UNPROCESSABLE_ENTITY': 'Dữ liệu không thể xử lý',
      'INTERNAL_SERVER_ERROR': 'Lỗi máy chủ nội bộ',
      'SERVICE_UNAVAILABLE': 'Dịch vụ không khả dụng',
      // Thêm các error code cụ thể
      'STUDENT_HAS_REGISTRATIONS': 'Học sinh đang có đăng ký lớp học',
      'PARENT_HAS_STUDENTS': 'Phụ huynh đang có học sinh',
      'CLASS_HAS_REGISTRATIONS': 'Lớp học đang có học sinh đăng ký',
      'SUBSCRIPTION_IN_USE': 'Gói học đang được sử dụng',
      'SUBSCRIPTION_TOTAL_LT_USED': 'Tổng buổi học không thể ít hơn số buổi đã dùng',
      'SUBSCRIPTION_EXTEND_NO_PARAM': 'Cần truyền tham số để gia hạn gói học',
      'SAME_PARENT_TARGET': 'Không thể chuyển học sinh sang cùng phụ huynh',
      'STUDENT_NOT_BELONG_TO_PARENT': 'Học sinh không thuộc phụ huynh nguồn'
    };
    
    if (errorCodeMap[backendCode]) {
      return errorCodeMap[backendCode];
    }
  }

  // Kiểm tra HTTP status code
  const statusCode = error?.response?.status;
  if (statusCode) {
    const statusCodeMap = {
      400: 'Yêu cầu không hợp lệ',
      401: 'Chưa đăng nhập',
      403: 'Không có quyền truy cập',
      404: 'Không tìm thấy dữ liệu',
      405: 'Phương thức không được hỗ trợ',
      409: 'Dữ liệu bị xung đột',
      422: 'Dữ liệu không thể xử lý',
      500: 'Lỗi máy chủ nội bộ',
      503: 'Dịch vụ không khả dụng'
    };
    
    if (statusCodeMap[statusCode]) {
      return statusCodeMap[statusCode];
    }
  }

  // Kiểm tra error message từ network
  if (error?.message) {
    // Lọc bỏ các message không hữu ích
    const networkMessage = error.message;
    if (!networkMessage.includes('Network Error') && 
        !networkMessage.includes('timeout') &&
        !networkMessage.includes('Request failed')) {
      return networkMessage;
    }
  }

  // Trả về fallback message
  return fallbackMessage;
};

/**
 * Log error chi tiết để debug
 * @param {Error} error - Error object từ catch block
 * @param {string} context - Context của error (tên function/component)
 */
export const logError = (error, context = 'Unknown') => {
  console.error(`[${context}] Error:`, error);
  console.error(`[${context}] Error details:`, {
    message: error?.message,
    response: error?.response?.data,
    status: error?.response?.status,
    config: error?.config
  });
};

/**
 * Xử lý error và hiển thị message
 * @param {Error} error - Error object từ catch block
 * @param {Function} message - Ant Design message function
 * @param {string} fallbackMessage - Message mặc định
 * @param {string} context - Context để log
 */
export const handleError = (error, message, fallbackMessage = 'Có lỗi xảy ra', context = 'Unknown') => {
  // Log error để debug
  logError(error, context);
  
  // Hiển thị message lỗi
  const errorMessage = getErrorMessage(error, fallbackMessage);
  message.error(errorMessage);
};

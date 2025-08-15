package com.teenup.contest.exception;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

public enum ErrorCode {
    PARENT_NOT_FOUND   ("PARENT_NOT_FOUND",    HttpStatus.NOT_FOUND,            "Không tìm thấy phụ huynh"),
    VALIDATION_FAILED  ("VALIDATION_FAILED",   HttpStatus.UNPROCESSABLE_ENTITY, "Dữ liệu không hợp lệ"),
    CONFLICT           ("CONFLICT",            HttpStatus.CONFLICT,             "Dữ liệu xung đột/vi phạm ràng buộc"),
    INTERNAL_ERROR     ("INTERNAL_ERROR",      HttpStatus.INTERNAL_SERVER_ERROR,"Lỗi hệ thống không mong muốn"),
    PARENT_HAS_STUDENTS    ("PARENT_HAS_STUDENTS",    HttpStatus.CONFLICT,   "Phụ huynh đang có học sinh, không thể xoá"),

    STUDENT_NOT_FOUND  ("STUDENT_NOT_FOUND",   HttpStatus.NOT_FOUND,            "Không tìm thấy học sinh"),
    STUDENT_HAS_REGISTRATIONS ("STUDENT_HAS_REGISTRATIONS", HttpStatus.CONFLICT, "Học sinh đang có đăng ký lớp, không thể xóa"),
    STUDENT_HAS_ACTIVE_SUBS  ("STUDENT_HAS_ACTIVE_SUBS",  HttpStatus.CONFLICT, "Học sinh đang có gói học còn hiệu lực/ còn buổi, không thể xóa"),

    CLASS_NOT_FOUND   ("CLASS_NOT_FOUND", HttpStatus.NOT_FOUND, "Không tìm thấy lớp học"),
    INVALID_DAY       ("INVALID_DAY",     HttpStatus.BAD_REQUEST, "Giá trị dayOfWeek không hợp lệ (1-7)"),
    CLASS_CONFLICT    ("CLASS_CONFLICT",  HttpStatus.CONFLICT, "Lớp học trùng lịch hoặc vi phạm ràng buộc"),
    CLASS_HAS_REGISTRATIONS      ("CLASS_HAS_REGISTRATIONS",      HttpStatus.CONFLICT,   "Lớp đang có học sinh đăng ký, không thể xoá"),
    CLASS_CAPACITY_TOO_SMALL     ("CLASS_CAPACITY_TOO_SMALL",     HttpStatus.CONFLICT,   "maxStudents nhỏ hơn số học sinh đã đăng ký"),

    ALREADY_REGISTERED   ("ALREADY_REGISTERED",   HttpStatus.CONFLICT,   "Học sinh đã đăng ký lớp này"),
    CLASS_FULL           ("CLASS_FULL",           HttpStatus.CONFLICT,   "Lớp đã đủ số lượng"),
    SCHEDULE_CONFLICT    ("SCHEDULE_CONFLICT",    HttpStatus.CONFLICT,   "Trùng lịch với lớp khác"),

    REGISTRATION_NOT_FOUND   ("REGISTRATION_NOT_FOUND",   HttpStatus.NOT_FOUND,  "Không tìm thấy đăng ký lớp"),
    SAME_CLASS_TARGET        ("SAME_CLASS_TARGET",        HttpStatus.CONFLICT,   "Lớp đích trùng với lớp hiện tại"),

    SUBSCRIPTION_IN_USE           ("SUBSCRIPTION_IN_USE",          HttpStatus.CONFLICT, "Gói đã phát sinh buổi, không thể xóa"),
    SUBSCRIPTION_INVALID_DATES    ("SUBSCRIPTION_INVALID_DATES",   HttpStatus.UNPROCESSABLE_ENTITY, "endDate phải >= startDate"),
    SUBSCRIPTION_TOTAL_LT_USED    ("SUBSCRIPTION_TOTAL_LT_USED",   HttpStatus.CONFLICT, "totalSessions < usedSessions hiện tại"),

    SUBSCRIPTION_NOT_FOUND ("SUBSCRIPTION_NOT_FOUND", HttpStatus.NOT_FOUND, "Không tìm thấy gói học"),
    SUBSCRIPTION_INACTIVE  ("SUBSCRIPTION_INACTIVE",  HttpStatus.CONFLICT, "Gói học chưa hiệu lực hoặc đã hết hạn"),
    NO_REMAINING_SESSIONS  ("NO_REMAINING_SESSIONS",  HttpStatus.CONFLICT, "Gói học đã dùng hết số buổi");




    private final String code;
    private final HttpStatus status;
    private final String defaultMessage;

    ErrorCode(String code, HttpStatus status, String defaultMessage) {
        this.code = code; this.status = status; this.defaultMessage = defaultMessage;
    }

    public String code() { return code; }
    public HttpStatus status() { return status; }
    public String defaultMessage() { return defaultMessage; }
}

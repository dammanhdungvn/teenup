package com.teenup.contest.exception;

public class RegistrationNotFoundException extends BaseException {
    public RegistrationNotFoundException(Long classId, Long studentId) {
        super(ErrorCode.REGISTRATION_NOT_FOUND,
                "Không tìm thấy đăng ký: classId=" + classId + ", studentId=" + studentId);
    }
}

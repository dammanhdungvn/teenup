package com.teenup.contest.exception;

public class StudentHasRegistrationsException extends BaseException {
    public StudentHasRegistrationsException(Long id) {
        super(ErrorCode.STUDENT_HAS_REGISTRATIONS, "Học sinh id=" + id + " đang có đăng ký lớp");
    }
}

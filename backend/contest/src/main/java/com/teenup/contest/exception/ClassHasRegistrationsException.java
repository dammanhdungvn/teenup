package com.teenup.contest.exception;

public class ClassHasRegistrationsException extends BaseException {
    public ClassHasRegistrationsException(Long id) {
        super(ErrorCode.CLASS_HAS_REGISTRATIONS, "Lớp id=" + id + " đang có học sinh đăng ký");
    }
}

package com.teenup.contest.exception;

public class AlreadyRegisteredException extends BaseException {
    public AlreadyRegisteredException(Long classId, Long studentId) {
        super(ErrorCode.ALREADY_REGISTERED, "Học sinh " + studentId + " đã đăng ký lớp " + classId);
    }
}
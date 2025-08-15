package com.teenup.contest.exception;

public class ClassCapacityTooSmallException extends BaseException {
    public ClassCapacityTooSmallException(int maxStudents, long currentRegs) {
        super(ErrorCode.CLASS_CAPACITY_TOO_SMALL,
                "maxStudents=" + maxStudents + " < số đăng ký hiện tại=" + currentRegs);
    }
}
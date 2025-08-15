package com.teenup.contest.exception;

public class SameClassTargetException extends BaseException {
    public SameClassTargetException(Long classId) {
        super(ErrorCode.SAME_CLASS_TARGET, "Lớp đích trùng với lớp hiện tại: classId=" + classId);
    }
}

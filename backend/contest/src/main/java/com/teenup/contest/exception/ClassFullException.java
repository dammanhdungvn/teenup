package com.teenup.contest.exception;

public class ClassFullException extends BaseException {
    public ClassFullException(Long classId) {
        super(ErrorCode.CLASS_FULL, "Lớp " + classId + " đã đủ số lượng");
    }
}
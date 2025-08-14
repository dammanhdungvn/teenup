package com.teenup.contest.exception;

public class ClassNotFoundException extends BaseException {
    public ClassNotFoundException(Long id) {
        super(ErrorCode.CLASS_NOT_FOUND, "Không tìm thấy lớp học: id=" + id);
    }
}

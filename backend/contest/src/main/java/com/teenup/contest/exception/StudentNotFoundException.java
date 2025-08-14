package com.teenup.contest.exception;

public class StudentNotFoundException extends BaseException {
    public StudentNotFoundException(Long id) {
        super(ErrorCode.STUDENT_NOT_FOUND, "Không tìm thấy học sinh: id=" + id);
    }
}

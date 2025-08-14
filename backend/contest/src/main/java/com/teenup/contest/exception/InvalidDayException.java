package com.teenup.contest.exception;

public class InvalidDayException extends BaseException {
    public InvalidDayException(Integer day) {
        super(ErrorCode.INVALID_DAY, "Giá trị dayOfWeek không hợp lệ: " + day + " (phải từ 1 đến 7)");
    }
}
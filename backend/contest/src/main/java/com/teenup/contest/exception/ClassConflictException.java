package com.teenup.contest.exception;

public class ClassConflictException extends BaseException {
    public ClassConflictException(String msg) {
        super(ErrorCode.CLASS_CONFLICT, msg);
    }
}
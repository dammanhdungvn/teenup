package com.teenup.contest.exception;

import lombok.Getter;

@Getter
public class BaseException extends RuntimeException {
    private final ErrorCode errorCode;

    public BaseException(ErrorCode errorCode) {
        super(errorCode.defaultMessage());
        this.errorCode = errorCode;
    }
    // if !message.isBlank() == true -> string is empty or whitespace,v.v.v
    public BaseException(ErrorCode errorCode, String message) {
        super(message != null && !message.isBlank() ? message : errorCode.defaultMessage());
        this.errorCode = errorCode;
    }
}
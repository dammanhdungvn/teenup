package com.teenup.contest.exception;

public class ScheduleConflictException extends BaseException {
    public ScheduleConflictException(String msg) {
        super(ErrorCode.SCHEDULE_CONFLICT, msg);
    }
}
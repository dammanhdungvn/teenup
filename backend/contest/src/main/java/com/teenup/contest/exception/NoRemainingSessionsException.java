package com.teenup.contest.exception;


public class NoRemainingSessionsException extends BaseException {
    public NoRemainingSessionsException(Long id) {
        super(ErrorCode.NO_REMAINING_SESSIONS, "Gói học id=" + id + " đã dùng hết số buổi");
    }
}

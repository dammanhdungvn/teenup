package com.teenup.contest.exception;

public class StudentHasActiveSubscriptionsException extends BaseException {
    public StudentHasActiveSubscriptionsException(Long id) {
        super(ErrorCode.STUDENT_HAS_ACTIVE_SUBS, "Học sinh id=" + id + " đang có gói học còn hiệu lực/ còn buổi");
    }
}

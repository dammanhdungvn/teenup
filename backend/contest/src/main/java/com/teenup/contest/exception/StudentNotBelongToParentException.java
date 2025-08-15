package com.teenup.contest.exception;

import java.util.List;

public class StudentNotBelongToParentException extends BaseException {
    public StudentNotBelongToParentException(Long sourceParentId, List<Long> invalidIds) {
        super(
                ErrorCode.STUDENT_NOT_BELONG_TO_PARENT,
                "Các student không thuộc parent nguồn id=" + sourceParentId + ": " + invalidIds
        );
    }
}

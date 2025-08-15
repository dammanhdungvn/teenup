package com.teenup.contest.exception;


public class SameParentTargetException extends BaseException {
    public SameParentTargetException(Long parentId) {
        super(ErrorCode.SAME_PARENT_TARGET, "Parent đích trùng parent nguồn: id=" + parentId);
    }
}

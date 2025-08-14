package com.teenup.contest.exception;

public class ParentNotFoundException extends BaseException {
    public ParentNotFoundException(Long id) {
        super(ErrorCode.PARENT_NOT_FOUND, "Không tìm thấy phụ huynh: id=" + id);
    }
}
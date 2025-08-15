package com.teenup.contest.exception;

public class ParentHasStudentsException extends BaseException {
    public ParentHasStudentsException(Long id) {
        super(ErrorCode.PARENT_HAS_STUDENTS, "Phụ huynh id=" + id + " đang có học sinh, không thể xoá");
    }
}

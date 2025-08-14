package com.teenup.contest.exception;

public class SubscriptionNotFoundException extends BaseException {
    public SubscriptionNotFoundException(Long id) {
        super(ErrorCode.SUBSCRIPTION_NOT_FOUND, "Không tìm thấy gói học: id=" + id);
    }
}

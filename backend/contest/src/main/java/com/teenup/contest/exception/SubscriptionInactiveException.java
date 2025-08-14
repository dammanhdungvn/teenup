package com.teenup.contest.exception;

public class SubscriptionInactiveException extends BaseException {
    public SubscriptionInactiveException(Long id) {
        super(ErrorCode.SUBSCRIPTION_INACTIVE, "Gói học id=" + id + " chưa hiệu lực hoặc đã hết hạn");
    }
}
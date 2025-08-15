package com.teenup.contest.dto.request;


import jakarta.validation.constraints.Min;

import java.time.LocalDate;

/**
 * Ít nhất một trong hai trường phải có:
 * - addSessions: số buổi cộng thêm (>=1)
 * - endDate: ngày kết thúc mới (phải >= endDate hiện tại và >= startDate)
 */
public record ExtendSubscriptionRequest(
        @Min(value = 1, message = "addSessions phải >= 1")
        Integer addSessions,
        LocalDate endDate
) {}

package com.teenup.contest.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateSubscriptionRequest(
        @Size(max = 100) String packageName,
        LocalDate startDate,
        LocalDate endDate,
        @Min(value = 1, message = "totalSessions >= 1")
        Integer totalSessions
        // usedSessions KHÔNG cho chỉnh qua API này; chỉ dùng PATCH /use
) {
}

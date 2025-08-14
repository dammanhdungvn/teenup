package com.teenup.contest.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.time.LocalDate;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record SubscriptionResponse(
        Long id,
        Long studentId,
        String packageName,
        LocalDate startDate,
        LocalDate endDate,
        Integer totalSessions,
        Integer usedSessions,
        Integer remainingSessions,
        Instant createdAt,
        Instant updatedAt
) {}

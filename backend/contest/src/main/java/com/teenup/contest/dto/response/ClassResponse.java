package com.teenup.contest.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ClassResponse(
        Long id,
        String name,
        String subject,
        Integer dayOfWeek,
        String timeSlot,
        String teacherName,
        Integer maxStudents,
        java.time.Instant createdAt,
        java.time.Instant updatedAt
) {
}

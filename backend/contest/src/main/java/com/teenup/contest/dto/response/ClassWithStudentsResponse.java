package com.teenup.contest.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ClassWithStudentsResponse(
        Long id,
        String name,
        String subject,
        Integer dayOfWeek,
        String timeSlot,
        String teacherName,
        Integer maxStudents,
        List<RegisteredStudentBrief> students,
        Instant createdAt,
        Instant updatedAt
) {
}

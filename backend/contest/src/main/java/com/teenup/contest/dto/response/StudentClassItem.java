package com.teenup.contest.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record StudentClassItem(
        Long id,
        String name,
        String subject,
        Integer dayOfWeek,     // 1..7
        String timeSlot,       // HH:mm-HH:mm
        String teacherName,
        Integer maxStudents
) {}
package com.teenup.contest.dto.response;


import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record StudentClassBrief(
        Long id,
        String name,
        String subject,
        Integer dayOfWeek,
        String timeSlot,
        String teacherName
) {
}

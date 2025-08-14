package com.teenup.contest.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.teenup.contest.entity.Gender;

import java.time.LocalDate;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record StudentResponse(
        Long id,
        String name,
        LocalDate dob,
        Gender gender,
        String currentGrade,
        ParentBrief parent,
        java.time.Instant createdAt,
        java.time.Instant updatedAt
) {}

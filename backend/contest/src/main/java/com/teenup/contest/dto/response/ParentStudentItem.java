package com.teenup.contest.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDate;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ParentStudentItem(
        Long id,
        String name,
        LocalDate dob,
        String gender,       // M/F/O
        String currentGrade
) {}

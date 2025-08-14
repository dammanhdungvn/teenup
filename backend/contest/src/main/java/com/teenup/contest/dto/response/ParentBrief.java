package com.teenup.contest.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ParentBrief(
        Long id,
        String name,
        String phone,
        String email
) {}

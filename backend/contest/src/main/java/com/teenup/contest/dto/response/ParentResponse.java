package com.teenup.contest.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ParentResponse(
        Long id,
        String name,
        String phone,
        String email,
        java.time.Instant createdAt,
        java.time.Instant updatedAt
) {}

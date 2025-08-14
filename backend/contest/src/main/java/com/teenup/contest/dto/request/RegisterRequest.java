package com.teenup.contest.dto.request;

import jakarta.validation.constraints.NotNull;

public record RegisterRequest(
        @NotNull(message = "studentId không được để trống")
        Long studentId
) {
}

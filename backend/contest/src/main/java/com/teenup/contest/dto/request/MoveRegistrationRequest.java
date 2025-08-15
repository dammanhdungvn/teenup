package com.teenup.contest.dto.request;

import jakarta.validation.constraints.NotNull;

public record MoveRegistrationRequest(
        @NotNull(message = "targetClassId là bắt buộc")
        Long targetClassId
) {
}

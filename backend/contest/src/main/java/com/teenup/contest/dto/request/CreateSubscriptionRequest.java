package com.teenup.contest.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateSubscriptionRequest(
        @NotNull(message = "studentId không được để trống")
        Long studentId,

        @NotBlank(message = "Tên gói không được để trống")
        @Size(max = 100, message = "Tên gói tối đa 100 ký tự")
        String packageName,

        @NotNull(message = "startDate không được để trống")
        LocalDate startDate,

        @NotNull(message = "endDate không được để trống")
        LocalDate endDate,

        @NotNull(message = "totalSessions không được để trống")
        @Min(value = 0, message = "totalSessions phải >= 0")
        Integer totalSessions
) {
}

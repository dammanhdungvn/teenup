package com.teenup.contest.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.List;

/** Nếu studentIds null/empty -> chuyển TẤT CẢ học sinh từ parent nguồn sang parent đích */
public record ReassignStudentsRequest(
        @NotNull(message = "targetParentId là bắt buộc")
        Long targetParentId,
        List<Long> studentIds
) {}

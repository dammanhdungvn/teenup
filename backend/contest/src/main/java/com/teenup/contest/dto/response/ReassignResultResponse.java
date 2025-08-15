package com.teenup.contest.dto.response;

public record ReassignResultResponse(
        Long sourceParentId,
        Long targetParentId,
        int movedCount,
        long remainingAtSource
) {}

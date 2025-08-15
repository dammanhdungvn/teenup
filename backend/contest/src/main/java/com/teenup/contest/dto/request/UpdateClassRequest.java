package com.teenup.contest.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateClassRequest(
        @Size(max = 100) String name,
        @Size(max = 100) String subject,
        @Min(1) @Max(7) Integer dayOfWeek,
        @Pattern(regexp = "^\\d{2}:\\d{2}-\\d{2}:\\d{2}$", message = "timeSlot dạng HH:mm-HH:mm")
        String timeSlot,
        @Size(max = 100) String teacherName,
        @Min(1) Integer maxStudents
) {
}

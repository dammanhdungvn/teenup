package com.teenup.contest.dto.request;

import jakarta.validation.constraints.*;

public record CreateClassRequest(
        @NotBlank(message = "Tên lớp không được để trống")
        @Size(max = 100, message = "Tên lớp tối đa 100 ký tự")
        String name,

        @NotBlank(message = "Môn học không được để trống")
        @Size(max = 100, message = "Môn học tối đa 100 ký tự")
        String subject,

        @NotNull(message = "dayOfWeek không được để trống")
        @Min(value = 1, message = "dayOfWeek phải từ 1 đến 7")
        @Max(value = 7, message = "dayOfWeek phải từ 1 đến 7")
        Integer dayOfWeek,

        @NotBlank(message = "timeSlot không được để trống")
        @Pattern(regexp = "^\\d{2}:\\d{2}-\\d{2}:\\d{2}$", message = "timeSlot phải dạng HH:mm-HH:mm (vd: 09:00-10:30)")
        @Size(max = 20, message = "timeSlot tối đa 20 ký tự")
        String timeSlot,

        @NotBlank(message = "Tên giáo viên không được để trống")
        @Size(max = 100, message = "Tên giáo viên tối đa 100 ký tự")
        String teacherName,

        @NotNull(message = "maxStudents không được để trống")
        @Min(value = 1, message = "maxStudents phải >= 1")
        Integer maxStudents
) {}

package com.teenup.contest.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateStudentRequest(
        @Size(max = 100, message = "Tên tối đa 100 ký tự")
        String name,

        LocalDate dob, // validate past ở service nếu cần

        @Pattern(regexp = "M|F|O", message = "gender phải là M/F/O")
        String gender,

        @Size(max = 20, message = "currentGrade tối đa 20 ký tự")
        String currentGrade,

        Long parentId
) {
}

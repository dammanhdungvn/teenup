package com.teenup.contest.dto.request;

import com.teenup.contest.entity.Gender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateStudentRequest(
        @NotBlank(message = "Tên không được để trống")
        @Size(max = 100, message = "Tên tối đa 100 ký tự")
        String name,

        @NotNull(message = "Ngày sinh không được để trống")
        @Past(message = "Ngày sinh phải trước ngày hiện tại")
        LocalDate dob,

        @NotNull(message = "Giới tính không được để trống")
        Gender gender, // M/F/O

        @NotBlank(message = "Khối lớp không được để trống")
        @Size(max = 50, message = "Khối lớp tối đa 50 ký tự")
        String currentGrade,

        @NotNull(message = "parentId không được để trống")
        Long parentId
) {}

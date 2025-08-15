package com.teenup.contest.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateParentRequest(
        @Size(max = 100, message = "Tên tối đa 100 ký tự")
        String name,
        @Size(max = 20, message = "Số điện thoại tối đa 20 ký tự")
        String phone,
        @Email(message = "Email không hợp lệ")
        @Size(max = 100, message = "Email tối đa 100 ký tự")
        String email
) {}
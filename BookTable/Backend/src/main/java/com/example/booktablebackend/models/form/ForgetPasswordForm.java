package com.example.booktablebackend.models.form;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * @author :37824
 * @description:TODO
 * @date :2025/05/02 20:21
 */
@Data
public class ForgetPasswordForm {
    @NotBlank(message = "Email is required")
    private String email;
    @NotBlank(message = "Password is required")
    private String password;
}

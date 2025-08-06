package com.example.booktablebackend.models.form;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * @author :37824
 * @description:TODO
 * @date :2025/05/02 20:20
 */
@Data
public class VerifyCodeForm {
    @NotBlank(message = "Username is required")
    private String email;
    @NotBlank(message = "Code is required")
    private String code;
}

package com.example.booktablebackend.models.form;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * @author :37824
 * @description:TODO
 * @date :2025/05/02 20:29
 */
@Data
public class LogoutForm {
    @NotBlank(message = "Satoken is required")
    private String satoken;
}

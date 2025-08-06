package com.example.booktablebackend.models.form;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * @author :37824
 * @description:TODO
 * @date :2025/05/02 20:18
 */
@Data
public class EmailForm {
    @NotBlank(message = "Email is required")
    private String email;
}

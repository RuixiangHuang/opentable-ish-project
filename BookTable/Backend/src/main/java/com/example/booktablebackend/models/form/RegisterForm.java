package com.example.booktablebackend.models.form;

import com.example.booktablebackend.models.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * @author :37824
 * @description:TODO
 * @date :2025/04/17 22:44
 */
@Data
public class RegisterForm {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Verification code is required")
    private String verificationCode;

    @NotBlank(message = "Contact method is required")
    private String contactMethod;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phoneNum;

    @NotNull(message = "Role is required")
    private Role role;
}

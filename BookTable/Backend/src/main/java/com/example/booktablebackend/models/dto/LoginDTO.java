package com.example.booktablebackend.models.dto;

import lombok.Data;

/**
 * @author :37824
 * @description:TODO
 * @date :2025/05/02 20:37
 */
@Data
public class LoginDTO {
    String satoken;
    String role;
    Long userId;
}

package com.example.booktablebackend.component;

import cn.dev33.satoken.exception.NotLoginException;
import cn.dev33.satoken.exception.NotPermissionException;
import cn.dev33.satoken.exception.NotRoleException;
import cn.dev33.satoken.exception.SaTokenException;
import com.example.booktablebackend.component.constants.HTTPCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;



/**
 * @author :37824
 * @description:TODO
 * @date :2025/04/17 21:59
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseDTO<String> handleException(Exception e) {
        log.error("Internal error: {}", e.getMessage(), e);

        return ResponseDTO.fail(HTTPCode.INTERNAL_ERROR, "Internal error");
    }

    @ExceptionHandler(SaTokenException.class)
    public ResponseDTO<String> handleSaTokenException(SaTokenException e) {
        log.warn("SaToken error: {}", e.getMessage());

        if (e instanceof NotLoginException) {
            return ResponseDTO.fail(HTTPCode.UNAUTHORIZED, "Not logged in or session expired");
        } else if (e instanceof NotRoleException) {
            return ResponseDTO.fail(HTTPCode.FORBIDDEN, "Insufficient role permissions");
        } else if (e instanceof NotPermissionException) {
            return ResponseDTO.fail(HTTPCode.FORBIDDEN, "Access denied: insufficient permissions");
        }

        return ResponseDTO.fail(HTTPCode.UNAUTHORIZED, "Authentication failed, please log in again");
    }

}

package com.example.booktablebackend.controller;

import com.example.booktablebackend.models.dto.LoginDTO;
import com.example.booktablebackend.models.form.*;
import com.example.booktablebackend.services.MailService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.booktablebackend.component.ResponseDTO;
import com.example.booktablebackend.services.UserService;

@RestController
@RequestMapping("/auth")
public class LoginController {

    @Autowired
    UserService userService;

    @Autowired
    MailService mailService;

    @SuppressWarnings("SameReturnValue")
    @Operation(summary = "ping testing", description = "health check")
    @GetMapping("/ping")
    public String ping(){
        return "pong!";
    }

    @PostMapping("/login")
    public ResponseDTO<LoginDTO> login(@RequestBody LoginForm form){
        return userService.loginUser(form);
    }

    @PostMapping("/logout")
    public ResponseDTO<String> logout(@RequestBody LogoutForm form) {
        String token = form.getSatoken();
        userService.logoutUser(token);
        return ResponseDTO.ok("Logout successful");
    }

    @PostMapping("/register")
    public ResponseDTO<String> register(@RequestBody RegisterForm form){
        return userService.registerUser(form);
    }


    @PostMapping("/send_verification")
    public ResponseDTO<String> sendVerificationCode(@RequestBody EmailForm form) throws MessagingException {
        String mailAddress = form.getEmail();
        mailService.sendVerificationEmail(mailAddress);
        return ResponseDTO.ok();
    }

    @PostMapping("/verify_code")
    public ResponseDTO<Boolean> verifyCode(@RequestBody VerifyCodeForm form){
        return userService.verifyCode(form.getEmail(), form.getCode());
    }


    @PostMapping("/forget_password")
    public ResponseDTO<String> forgetPassword(@RequestBody ForgetPasswordForm form){
        return userService.forgetPassword(form.getEmail(), form.getPassword());
    }
}

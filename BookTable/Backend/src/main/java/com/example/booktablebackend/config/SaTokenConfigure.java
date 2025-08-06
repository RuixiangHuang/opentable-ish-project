package com.example.booktablebackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.jwt.StpLogicJwtForSimple;
import cn.dev33.satoken.stp.StpLogic;
import cn.dev33.satoken.stp.StpUtil;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class SaTokenConfigure implements WebMvcConfigurer {
    @Bean
    public StpLogic getStpLogicJwt() {
        return new StpLogicJwtForSimple();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SaInterceptor(handle -> {
                    log.info("Validating login status...");
                    try {
                        StpUtil.checkLogin();
                        log.info("Login validated");
                    } catch (Exception e) {
                        log.error("Login fail: {}", e.getMessage());
                        throw e;
                    }
                }))
                .addPathPatterns("/**")
                .excludePathPatterns("/**");
                /*
                        "/auth/login",
                        "/auth/ping",
                        "/auth/register",
                        "/auth/logout",
                        "/auth/send_verification",
                        "/api/restaurants"

                 */


    }
}

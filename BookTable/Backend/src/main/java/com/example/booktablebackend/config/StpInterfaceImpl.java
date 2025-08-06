package com.example.booktablebackend.config;

import cn.dev33.satoken.stp.StpInterface;
import com.example.booktablebackend.models.Role;
import com.example.booktablebackend.models.User;
import com.example.booktablebackend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class StpInterfaceImpl implements StpInterface {

    @Autowired
    private UserService userService;

    @Override
    public List<String> getPermissionList(Object loginId, String loginType) {
        return List.of();
    }

    @Override
    public List<String> getRoleList(Object loginId, String loginType) {
        Optional<User> user = userService.findById(Long.valueOf(loginId.toString()));
        if (user.isEmpty()) {
            return List.of();
        }
        Role role = user.get().getRole();

        return List.of(user.get().getRole().getCode());
    }
}

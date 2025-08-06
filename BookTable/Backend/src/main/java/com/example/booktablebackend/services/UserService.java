package com.example.booktablebackend.services;

import cn.dev33.satoken.stp.StpUtil;
import com.example.booktablebackend.component.ResponseDTO;
import com.example.booktablebackend.component.constants.HTTPCode;
import com.example.booktablebackend.models.User;
import com.example.booktablebackend.models.dto.LoginDTO;
import com.example.booktablebackend.models.form.LoginForm;
import com.example.booktablebackend.models.form.RegisterForm;
import com.example.booktablebackend.repos.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.PropertyValueException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationCodeService verificationCodeService;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> saveUsers(List<User> users) {
        return userRepository.saveAll(users);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User findByPhone(String phoneNum) {
        return userRepository.findByPhoneNum(phoneNum);
    }

    final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    public User updateUser(User user) throws PropertyValueException {
        User existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser == null) {
            return userRepository.save(user);
        }
        existingUser.setContactMethod(user.getContactMethod());
        existingUser.setPhoneNum(user.getPhoneNum());
        String field = "";
        try {
            field = "email";
            existingUser.setEmail(user.getEmail());
            field = "username";
            existingUser.setUsername(user.getUsername());
            field = "password";
            existingUser.setPassword(user.getPassword());
        } catch (NullPointerException e) {
            throw new PropertyValueException("Not-null property references a null or transient value", "User", field);
        }
        return userRepository.save(existingUser);
    }

    public ResponseDTO<LoginDTO> loginUser(LoginForm form){
        User tempUser = findByEmail(form.getEmail());
        if(tempUser == null){
            return ResponseDTO.error(HTTPCode.NOT_FOUND);
        }
        Long userId = tempUser.getId();
        if(encoder.matches(form.getPassword(), tempUser.getPassword())){
            StpUtil.login(userId);
            LoginDTO dto = new LoginDTO();
            dto.setSatoken(StpUtil.getTokenValueByLoginId(userId));
            dto.setRole(tempUser.getRole().getCode());
            dto.setUserId(userId);
            return ResponseDTO.ok("Successfully login.", dto);
        }
        log.info("Fail to login");
        return ResponseDTO.fail(HTTPCode.PWD_ERROR, "Incorrect password");
    }

    public ResponseDTO<String> logoutUser(String token) {
        StpUtil.logout(token);
        return ResponseDTO.ok("Logout successful");
    }

    public ResponseDTO<String> registerUser(RegisterForm form){
        if(!verificationCodeService.verifyCode(form.getEmail(), form.getVerificationCode())){
            return ResponseDTO.fail(HTTPCode.BAD_REQUEST, "Wrong verification code");
        }
        if(userRepository.existsByEmail(form.getEmail())){
            return ResponseDTO.error(HTTPCode.BAD_REQUEST, String.format("User %s already exists", form.getEmail()));
        }
        User user = new User();
        user.setUsername(form.getUsername());
        user.setPassword(encoder.encode(form.getPassword()));
        user.setContactMethod(form.getContactMethod());
        user.setEmail(form.getEmail());
        user.setPhoneNum(form.getPhoneNum());
        user.setRole(form.getRole());
        saveUser(user);
        return ResponseDTO.ok("Successful register user.");
    }

    public ResponseDTO<String> forgetPassword(String email, String password){
        User user = userRepository.findByEmail(email);
        user.setPassword(encoder.encode(password));
        saveUser(user);
        return ResponseDTO.ok();
    }

    public ResponseDTO<Boolean> verifyCode(String email, String code){
        return ResponseDTO.ok(verificationCodeService.verifyCode(email, code));
    }
}

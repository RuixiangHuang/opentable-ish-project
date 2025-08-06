package com.example.booktablebackend.repos;

import com.example.booktablebackend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);
    User findByEmail(String email);
    User findByPhoneNum(String phoneNum);
    boolean existsByEmail(String email);
}

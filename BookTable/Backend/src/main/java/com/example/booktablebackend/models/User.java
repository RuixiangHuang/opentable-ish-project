package com.example.booktablebackend.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column()
    private String contactMethod;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true)
    private String phoneNum;

    @Column
    @Convert(converter = RoleConverter.class)
    private Role role;

}


package com.elearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InstructorDto {
    private String instructorId;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String token;
    private String address;
    private String education;
    private String role;
    private String phone;
    private String experience;
    private String departmentId;
    private List<GrantedAuthority> authorities;
}


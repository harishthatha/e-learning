package com.elearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDto {
    private String studentId;
    private String studentIdNumber;
    private String username; // Add this field
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String program;
    private String address;
    private String graduationLevel;
    private String phone;
    private String token;
    private String role;
    private String departmentId;
    private List<GrantedAuthority> authorities; // Roles and permissions
    private List<AssignmentsDto> assignmentDtos;
    private EnrollmentDto enrollmentDto;
}


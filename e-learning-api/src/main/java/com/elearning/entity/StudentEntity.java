package com.elearning.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "student")
public class StudentEntity {

    @Id
    private String studentId;
    private String studentIdNumber;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String program;
    private String phone;
    private String departmentId;
}

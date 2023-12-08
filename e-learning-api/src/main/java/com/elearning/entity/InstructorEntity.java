package com.elearning.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "instructor")
public class InstructorEntity {

    @Id
    private String instructorId;

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phone;
    private String experience;
    private String departmentId;
    private String education;
}

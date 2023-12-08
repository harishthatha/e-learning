package com.elearning.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "admin")
public class AdminEntity {

    @Id
    private String adminId;

    private String firstName;
    private String lastName;
    private String email;
    private String password;
}


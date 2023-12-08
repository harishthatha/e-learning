package com.elearning.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "enrollment")
public class EnrollmentEntity {

    @Id
    private String enrollmentId;
    private int crn;
    private String studentId;
    private String grade;
    private String sectionId;
    private LocalDate enrollmentDate;
}

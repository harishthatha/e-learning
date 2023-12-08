package com.elearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EnrollmentDto {
    private int crn;
    private String studentId;
    private String grade;
    private String enrollmentId;
    private String sectionId;
    private String enrollmentDate;
}



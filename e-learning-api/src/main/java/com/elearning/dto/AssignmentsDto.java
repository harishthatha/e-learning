package com.elearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentsDto {
    private String assignmentId;
    private String sectionId;
    private String title;
    private String description;
    private String dueDate;
    private String dueTime;
    private int points;
    private SubmissionDto submission;
    private EnrollmentDto enrollment;
    private String attachmentUrl;
    private MultipartFile attachment;
}


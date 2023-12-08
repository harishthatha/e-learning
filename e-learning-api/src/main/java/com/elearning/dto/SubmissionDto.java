package com.elearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubmissionDto {
    private String submissionId;

    private String assignmentId;
    private String studentId;
    private String sectionId;
    private String points;
    private String comment;
    private String dateTime;
    private String status;
    private String fileUrl;
}


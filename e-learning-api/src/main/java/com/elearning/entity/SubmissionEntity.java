package com.elearning.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "submission")
public class SubmissionEntity {

    @Id
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

package com.elearning.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "assignments")
public class AssignmentsEntity {

    @Id
    private String assignmentId;
    private String sectionId;
    private String title;
    private String description;
    private String attachmentUrl;
    private String dueDate;
    private String dueTime;
    private int points;
}

package com.elearning.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "course")
public class CoursesEntity {

    @Id
    private String courseId;
    private List<String> departments;
    private String courseCode;
    private String title;
    private String description;
    private int creditHours;
}

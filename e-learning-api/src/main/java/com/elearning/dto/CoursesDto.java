package com.elearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CoursesDto {
    private String courseId;
    private List<String> departments;
    private int courseCode;
    private String title;
    private String description;
    private int creditHours;
    private List<SectionDto> sections;
}


package com.elearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SectionDto {
    private String sectionId;
    private String name;
    private int maxStrength;
    private int sectionCode;
    private String courseId;
    private List<String> listOfStudents;
    private List<String> listOfDays;

    private List<String> listOfEnrolledSections;
    private String instructorId;
    private CoursesDto course;
    private String day;
    private String startTime;
    private String endTime;

    private String crnNumber;
    private String timings;
    private int creditHours;
    private int totalSeats;
    private int availableSeats;
}


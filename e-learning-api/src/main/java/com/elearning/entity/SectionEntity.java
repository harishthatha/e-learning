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
@Document(collection = "section")
public class SectionEntity {

    @Id
    private String sectionId;
    private String name;
    private int maxStrength;
    private int sectionCode;
    private String courseId;
    private List<String> listOfStudents;
    private String instructorId;
    private String crnNumber;
    private String timings;
    private String day;
    private String startTime;
    private String endTime;
    private int creditHours;
    private int totalSeats;
    private int availableSeats;


}

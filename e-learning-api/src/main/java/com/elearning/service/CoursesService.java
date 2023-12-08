package com.elearning.service;

import com.elearning.dto.CoursesDto;
import com.elearning.exception.CoursesNotFoundException;

import java.util.List;
import java.util.Optional;

public interface CoursesService {
    List<CoursesDto> getCourses();

    Optional<CoursesDto> getCourse(String id) throws CoursesNotFoundException;

    CoursesDto addCourse(CoursesDto coursesDto);

    Optional<CoursesDto> updateCourse(String id, CoursesDto updatedCoursesDto) throws CoursesNotFoundException;

    void deleteCourse(String id) throws CoursesNotFoundException;
}

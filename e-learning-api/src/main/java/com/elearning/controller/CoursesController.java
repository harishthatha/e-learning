package com.elearning.controller;

import com.elearning.dto.CoursesDto;
import com.elearning.exception.CoursesNotFoundException;
import com.elearning.service.CoursesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/courses")
public class CoursesController {

    @Autowired
    private CoursesService coursesService;

    @GetMapping
    public ResponseEntity<List<CoursesDto>> getCourses() {
        List<CoursesDto> courses = coursesService.getCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CoursesDto> getCourse(@PathVariable String id) throws CoursesNotFoundException {
        Optional<CoursesDto> course = coursesService.getCourse(id);
        return ResponseEntity.ok(course.orElse(null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CoursesDto> updateCourse(@PathVariable String id, @RequestBody CoursesDto updatedCoursesDto) throws CoursesNotFoundException {
        Optional<CoursesDto> updatedCourse = coursesService.updateCourse(id, updatedCoursesDto);
        return ResponseEntity.ok(updatedCourse.orElse(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String id) throws CoursesNotFoundException {
        coursesService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<CoursesDto> addCourse(@RequestBody CoursesDto coursesDto) {
        CoursesDto newCourse = coursesService.addCourse(coursesDto);
        return ResponseEntity.ok(newCourse);
    }
}

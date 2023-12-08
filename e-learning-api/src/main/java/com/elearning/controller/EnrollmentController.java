package com.elearning.controller;

import com.elearning.dto.EnrollmentDto;
import com.elearning.exception.EnrollmentNotFoundException;
import com.elearning.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @GetMapping
    public ResponseEntity<List<EnrollmentDto>> getEnrollments() {
        List<EnrollmentDto> enrollments = enrollmentService.getEnrollments();
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentDto> getEnrollment(@PathVariable String id) throws EnrollmentNotFoundException {
        Optional<EnrollmentDto> enrollment = enrollmentService.getEnrollment(id);
        return ResponseEntity.ok(enrollment.orElse(null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnrollmentDto> updateEnrollment(@PathVariable String id, @RequestBody EnrollmentDto updatedEnrollmentDto) throws EnrollmentNotFoundException {
        Optional<EnrollmentDto> updatedEnrollment = enrollmentService.updateEnrollment(id, updatedEnrollmentDto);
        return ResponseEntity.ok(updatedEnrollment.orElse(null));
    }

    @PutMapping("/{id}/update-final-grade")
    public ResponseEntity<EnrollmentDto> updateFinalGrade(@PathVariable String id, @RequestBody EnrollmentDto updatedEnrollmentDto) throws EnrollmentNotFoundException {
        Optional<EnrollmentDto> updatedEnrollment = enrollmentService.updateFinalGrade(id, updatedEnrollmentDto);
        return ResponseEntity.ok(updatedEnrollment.orElse(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable String id) throws EnrollmentNotFoundException {
        enrollmentService.deleteEnrollment(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<EnrollmentDto> addEnrollment(@RequestBody EnrollmentDto enrollmentDto) {
        EnrollmentDto newEnrollment = enrollmentService.addEnrollment(enrollmentDto);
        return ResponseEntity.ok(newEnrollment);
    }
}

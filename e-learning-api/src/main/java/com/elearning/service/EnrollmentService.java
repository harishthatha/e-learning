package com.elearning.service;

import com.elearning.dto.EnrollmentDto;
import com.elearning.exception.EnrollmentNotFoundException;

import java.util.List;
import java.util.Optional;

public interface EnrollmentService {
    List<EnrollmentDto> getEnrollments();

    Optional<EnrollmentDto> getEnrollment(String id) throws EnrollmentNotFoundException;

    EnrollmentDto addEnrollment(EnrollmentDto enrollmentDto);

    Optional<EnrollmentDto> updateEnrollment(String id, EnrollmentDto updatedEnrollmentDto) throws EnrollmentNotFoundException;

    void deleteEnrollment(String id) throws EnrollmentNotFoundException;

    Optional<EnrollmentDto> updateFinalGrade(String id, EnrollmentDto updatedEnrollmentDto);
}

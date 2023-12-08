package com.elearning.service;

import com.elearning.dto.AssignmentsDto;
import com.elearning.dto.EnrollmentDto;
import com.elearning.dto.SectionDto;
import com.elearning.dto.StudentDto;
import com.elearning.exception.StudentNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface StudentService {
    List<StudentDto> getStudents();

    Optional<StudentDto> getStudent(String id) throws StudentNotFoundException;

    StudentDto addStudent(StudentDto studentDto);

    Optional<StudentDto> updateStudent(String id, StudentDto updatedStudentDto) throws StudentNotFoundException;

    void deleteStudent(String id) throws StudentNotFoundException;

    StudentDto findByEmail(String email) throws StudentNotFoundException;

    StudentDto login(StudentDto studentDto);

    List<SectionDto> getStudentEnrolledClasses(String id);

    StudentDto enrollStudentClasses(String id, List<String> sectionIds);

    EnrollmentDto getStudentEnrollment(String id, String sectionId);

    AssignmentsDto submitAssignment(String id, String sectionId, String assignmentId, MultipartFile assignmentFile);

    AssignmentsDto addMarksToAssignment(String id, String assignmentId, int marks);

    List<AssignmentsDto> getStudentAssignments(String id, String sectionId);
}

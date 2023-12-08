package com.elearning.controller;

import com.elearning.config.UserAuthenticationProvider;
import com.elearning.dto.AssignmentsDto;
import com.elearning.dto.EnrollmentDto;
import com.elearning.dto.SectionDto;
import com.elearning.dto.StudentDto;
import com.elearning.exception.StudentNotFoundException;
import com.elearning.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private UserAuthenticationProvider userAuthenticationProvider;

    @GetMapping
    public ResponseEntity<List<StudentDto>> getStudents() {
        List<StudentDto> students = studentService.getStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDto> getStudent(@PathVariable String id) throws StudentNotFoundException {
        Optional<StudentDto> student = studentService.getStudent(id);
        return ResponseEntity.ok(student.orElse(null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDto> updateStudent(@PathVariable String id, @RequestBody StudentDto updatedStudentDto) throws StudentNotFoundException {
        Optional<StudentDto> updatedStudent = studentService.updateStudent(id, updatedStudentDto);
        return ResponseEntity.ok(updatedStudent.orElse(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable String id) throws StudentNotFoundException {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<StudentDto> addStudent(@RequestBody StudentDto studentDto) {
        StudentDto newStudent = studentService.addStudent(studentDto);
        return ResponseEntity.ok(newStudent);
    }

    @PostMapping("/login")
    public ResponseEntity<StudentDto> login(@RequestBody StudentDto studentDto) {
        StudentDto student = studentService.login(studentDto);
        student.setToken(userAuthenticationProvider.createToken(studentDto.getEmail(), student.getStudentId(), "ROLE_STUDENT"));
        return ResponseEntity.ok(student);
    }

    @GetMapping("/{id}/enrolled-courses")
    public ResponseEntity<List<SectionDto>> getStudentEnrolledClasses(@PathVariable String id) throws StudentNotFoundException {
        List<SectionDto> studentClasses = studentService.getStudentEnrolledClasses(id);
        return ResponseEntity.ok(studentClasses);
    }

    @GetMapping("/{id}/sections/{sectionId}/enrollment")
    public ResponseEntity<EnrollmentDto> getStudentEnrollment(@PathVariable String id, @PathVariable String sectionId) throws StudentNotFoundException {
        EnrollmentDto enrollment = studentService.getStudentEnrollment(id, sectionId);
        return ResponseEntity.ok(enrollment);
    }

    @PutMapping("/{id}/assignments/{assignmentId}/marks/{marks}")
    public ResponseEntity<AssignmentsDto> addMarksToAssignment(@PathVariable String id
            , @PathVariable String assignmentId, @PathVariable int marks
    ) throws StudentNotFoundException {
        AssignmentsDto assignmentDto = studentService.addMarksToAssignment(id, assignmentId, marks);
        return ResponseEntity.ok(assignmentDto);
    }

    @PostMapping("/{id}/sections/{sectionId}/assignments/{assignmentId}/submission")
    public ResponseEntity<AssignmentsDto> submitAssignment(@PathVariable String id
            , @PathVariable String sectionId, @PathVariable String assignmentId
            , @RequestPart("assignmentFile") MultipartFile assignmentFile) throws StudentNotFoundException {
        AssignmentsDto assignmentDto = studentService.submitAssignment(id, sectionId, assignmentId, assignmentFile);
        return ResponseEntity.ok(assignmentDto);
    }

    @GetMapping("/{id}/sections/{sectionId}/assignments")
    public ResponseEntity<List<AssignmentsDto>> getStudentAssignments(@PathVariable String id
            , @PathVariable String sectionId) throws StudentNotFoundException {
        List<AssignmentsDto> assignments = studentService.getStudentAssignments(id, sectionId);
        return ResponseEntity.ok(assignments);
    }


    @PostMapping("/{id}/enrolled-courses")
    public ResponseEntity<StudentDto> enrollStudentClasses(@PathVariable String id, @RequestBody List<String> sectionIds) throws StudentNotFoundException {
        StudentDto student = studentService.enrollStudentClasses(id, sectionIds);
        return ResponseEntity.ok(student);
    }
}

package com.elearning.controller;

import com.elearning.config.UserAuthenticationProvider;
import com.elearning.dto.AssignmentsDto;
import com.elearning.dto.InstructorDto;
import com.elearning.dto.SectionDto;
import com.elearning.exception.InstructorNotFoundException;
import com.elearning.service.InstructorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/instructors")
public class InstructorController {

    @Autowired
    private InstructorService instructorService;

    @Autowired
    private UserAuthenticationProvider userAuthenticationProvider;

    @GetMapping
    public ResponseEntity<List<InstructorDto>> getInstructors() {
        List<InstructorDto> instructors = instructorService.getInstructors();
        return ResponseEntity.ok(instructors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InstructorDto> getInstructor(@PathVariable String id) throws InstructorNotFoundException {
        Optional<InstructorDto> instructor = instructorService.getInstructor(id);
        return ResponseEntity.ok(instructor.orElse(null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InstructorDto> updateInstructor(@PathVariable String id, @RequestBody InstructorDto updatedInstructorDto) throws InstructorNotFoundException {
        Optional<InstructorDto> updatedInstructor = instructorService.updateInstructor(id, updatedInstructorDto);
        return ResponseEntity.ok(updatedInstructor.orElse(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstructor(@PathVariable String id) throws InstructorNotFoundException {
        instructorService.deleteInstructor(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<InstructorDto> addInstructor(@RequestBody InstructorDto instructorDto) {
        InstructorDto newInstructor = instructorService.addInstructor(instructorDto);
        return ResponseEntity.ok(newInstructor);
    }

    @PostMapping("/login")
    public ResponseEntity<InstructorDto> login(@RequestBody InstructorDto instructorDto) {
        InstructorDto instructor = instructorService.login(instructorDto);
        instructor.setToken(userAuthenticationProvider.createToken(instructorDto.getEmail(), instructor.getInstructorId(), "ROLE_INSTRUCTOR"));
        return ResponseEntity.ok(instructor);
    }

    @GetMapping("/{id}/courses")
    public ResponseEntity<List<SectionDto>> getInstructorCourses(@PathVariable String id) throws InstructorNotFoundException {
        List<SectionDto> courses = instructorService.getInstructorCourses(id);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}/sections/{sectionId}/assignments")
    public ResponseEntity<List<AssignmentsDto>> getSectionAssignments(@PathVariable String id, @PathVariable String sectionId) throws InstructorNotFoundException {
        List<AssignmentsDto> assignments = instructorService.getSectionAssignments(id, sectionId);
        return ResponseEntity.ok(assignments);
    }

    @PostMapping("/{id}/sections/{sectionId}/assignments")
    public ResponseEntity<AssignmentsDto> saveSectionAssignments(@PathVariable String id, @PathVariable String sectionId
            , @RequestBody AssignmentsDto assignmentDto) throws InstructorNotFoundException {
        AssignmentsDto assignment = instructorService.saveSectionAssignments(id, sectionId, assignmentDto);
        return ResponseEntity.ok(assignment);
    }

    @PutMapping("/{id}/sections/{sectionId}/assignments")
    public ResponseEntity<AssignmentsDto> updateSectionAssignments(@PathVariable String id, @PathVariable String sectionId
            , @RequestBody AssignmentsDto assignmentDto) throws InstructorNotFoundException {
        AssignmentsDto assignment = instructorService.updateSectionAssignments(id, sectionId, assignmentDto);
        return ResponseEntity.ok(assignment);
    }
}

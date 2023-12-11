package com.elearning.controller;

import com.elearning.dto.AssignmentsDto;
import com.elearning.exception.AssignmentsNotFoundException;
import com.elearning.service.AssignmentsService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/assignments")
public class AssignmentsController {

    @Autowired
    private AssignmentsService assignmentsService;

    @GetMapping
    public ResponseEntity<List<AssignmentsDto>> getAssignments() {
        List<AssignmentsDto> assignments = assignmentsService.getAssignments();
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/sections/{sectionId}")
    public ResponseEntity<List<AssignmentsDto>> getSectionAssignments(@RequestParam String sectionId) {
        List<AssignmentsDto> assignments = assignmentsService.getSectionAssignments(sectionId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssignmentsDto> getAssignment(@PathVariable String id) throws AssignmentsNotFoundException {
        Optional<AssignmentsDto> assignment = assignmentsService.getAssignment(id);
        return ResponseEntity.ok(assignment.orElse(null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssignmentsDto> updateAssignment(@PathVariable String id
            , @RequestPart(name = "attachment", required = false) MultipartFile attachment
            , @RequestPart("assignmentJson") String assignmentJson) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        AssignmentsDto updatedAssignmentsDto = objectMapper.readValue(assignmentJson, AssignmentsDto.class);
        updatedAssignmentsDto.setAttachment(attachment);
        Optional<AssignmentsDto> updatedAssignment = assignmentsService.updateAssignment(id, updatedAssignmentsDto);
        return ResponseEntity.ok(updatedAssignment.orElse(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable String id) throws AssignmentsNotFoundException {
        assignmentsService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<AssignmentsDto> addAssignment(
            @RequestPart(name = "attachment", required = false) MultipartFile attachment
            , @RequestPart("assignmentJson") String assignmentJson) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        AssignmentsDto assignmentsDto = objectMapper.readValue(assignmentJson, AssignmentsDto.class);
        assignmentsDto.setAttachment(attachment);
        AssignmentsDto newAssignment = assignmentsService.addAssignment(assignmentsDto);
        return ResponseEntity.ok(newAssignment);
    }

}

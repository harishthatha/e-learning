package com.elearning.controller;

import com.elearning.dto.SubmissionDto;
import com.elearning.exception.SubmissionNotFoundException;
import com.elearning.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @GetMapping
    public ResponseEntity<List<SubmissionDto>> getSubmissions() {
        List<SubmissionDto> submissions = submissionService.getSubmissions();
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubmissionDto> getSubmission(@PathVariable String id) throws SubmissionNotFoundException {
        Optional<SubmissionDto> submission = submissionService.getSubmission(id);
        return ResponseEntity.ok(submission.orElse(null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubmissionDto> updateSubmission(@PathVariable String id, @RequestBody SubmissionDto updatedSubmissionDto) throws SubmissionNotFoundException {
        Optional<SubmissionDto> updatedSubmission = submissionService.updateSubmission(id, updatedSubmissionDto);
        return ResponseEntity.ok(updatedSubmission.orElse(null));
    }

    @PutMapping("/{id}/update-points")
    public ResponseEntity<SubmissionDto> updateSubmissionPoints(@PathVariable String id, @RequestBody SubmissionDto updatedSubmissionDto) throws SubmissionNotFoundException {
        Optional<SubmissionDto> updatedSubmission = submissionService.updateSubmissionPoints(id, updatedSubmissionDto);
        return ResponseEntity.ok(updatedSubmission.orElse(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubmission(@PathVariable String id) throws SubmissionNotFoundException {
        submissionService.deleteSubmission(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<SubmissionDto> addSubmission(@RequestBody SubmissionDto submissionDto) {
        SubmissionDto newSubmission = submissionService.addSubmission(submissionDto);
        return ResponseEntity.ok(newSubmission);
    }
}

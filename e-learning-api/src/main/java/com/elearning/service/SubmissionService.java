package com.elearning.service;

import com.elearning.dto.SubmissionDto;
import com.elearning.exception.SubmissionNotFoundException;

import java.util.List;
import java.util.Optional;

public interface SubmissionService {
    List<SubmissionDto> getSubmissions();

    Optional<SubmissionDto> getSubmission(String id) throws SubmissionNotFoundException;

    SubmissionDto addSubmission(SubmissionDto submissionDto);

    Optional<SubmissionDto> updateSubmission(String id, SubmissionDto updatedSubmissionDto) throws SubmissionNotFoundException;

    void deleteSubmission(String id) throws SubmissionNotFoundException;

    Optional<SubmissionDto> updateSubmissionPoints(String id, SubmissionDto updatedSubmissionDto);
}

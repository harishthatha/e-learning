package com.elearning.service;

import com.elearning.dto.AssignmentsDto;
import com.elearning.exception.AssignmentsNotFoundException;

import java.util.List;
import java.util.Optional;

public interface AssignmentsService {
    List<AssignmentsDto> getAssignments();

    Optional<AssignmentsDto> getAssignment(String id) throws AssignmentsNotFoundException;

    AssignmentsDto addAssignment(AssignmentsDto assignmentsDto);

    Optional<AssignmentsDto> updateAssignment(String id, AssignmentsDto updatedAssignmentsDto) throws AssignmentsNotFoundException;

    void deleteAssignment(String id) throws AssignmentsNotFoundException;

    List<AssignmentsDto> getSectionAssignments(String sectionId);
}

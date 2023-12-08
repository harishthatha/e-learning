package com.elearning.service;

import com.elearning.dto.AssignmentsDto;
import com.elearning.dto.InstructorDto;
import com.elearning.dto.SectionDto;
import com.elearning.exception.InstructorNotFoundException;

import java.util.List;
import java.util.Optional;

public interface InstructorService {
    List<InstructorDto> getInstructors();

    Optional<InstructorDto> getInstructor(String id) throws InstructorNotFoundException;

    InstructorDto addInstructor(InstructorDto instructorDto);

    Optional<InstructorDto> updateInstructor(String id, InstructorDto updatedInstructorDto) throws InstructorNotFoundException;

    void deleteInstructor(String id) throws InstructorNotFoundException;

    InstructorDto findByEmail(String email) throws InstructorNotFoundException;

    InstructorDto login(InstructorDto instructorDto);

    List<SectionDto> getInstructorCourses(String id);

    List<AssignmentsDto> getSectionAssignments(String id, String sectionId);

    AssignmentsDto saveSectionAssignments(String id, String sectionId, AssignmentsDto assignmentDto);

    AssignmentsDto updateSectionAssignments(String id, String sectionId, AssignmentsDto assignmentDto);
}

package com.elearning.service;

import com.elearning.dto.AssignmentsDto;
import com.elearning.dto.SectionDto;
import com.elearning.dto.StudentDto;
import com.elearning.exception.SectionNotFoundException;

import java.util.List;
import java.util.Optional;

public interface SectionService {
    List<SectionDto> getSections();

    Optional<SectionDto> getSection(String id) throws SectionNotFoundException;

    List<SectionDto> addSection(SectionDto sectionDto);

    List<SectionDto> updateSection(String id, SectionDto updatedSectionDto) throws SectionNotFoundException;

    void deleteSection(String id) throws SectionNotFoundException;

    List<StudentDto> getSectionStudents(String id);

    List<AssignmentsDto> getSectionAssignments(String id);
}

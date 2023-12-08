package com.elearning.controller;

import com.elearning.dto.SectionDto;
import com.elearning.dto.StudentDto;
import com.elearning.exception.SectionNotFoundException;
import com.elearning.service.SectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sections")
public class SectionController {

    @Autowired
    private SectionService sectionService;

    @GetMapping
    public ResponseEntity<List<SectionDto>> getSections() {
        List<SectionDto> sections = sectionService.getSections();
        return ResponseEntity.ok(sections);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SectionDto> getSection(@PathVariable String id) throws SectionNotFoundException {
        Optional<SectionDto> section = sectionService.getSection(id);
        return ResponseEntity.ok(section.orElse(null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<List<SectionDto>> updateSection(@PathVariable String id, @RequestBody SectionDto updatedSectionDto) throws SectionNotFoundException {
        List<SectionDto> updatedSection = sectionService.updateSection(id, updatedSectionDto);
        return ResponseEntity.ok(updatedSection);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSection(@PathVariable String id) throws SectionNotFoundException {
        sectionService.deleteSection(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<List<SectionDto>> addSection(@RequestBody SectionDto sectionDto) {
        List<SectionDto> newSection = sectionService.addSection(sectionDto);
        return ResponseEntity.ok(newSection);
    }

    @GetMapping("/{id}/students")
    public ResponseEntity<List<StudentDto>> getSectionStudents(@PathVariable String id) throws SectionNotFoundException {
        List<StudentDto> students = sectionService.getSectionStudents(id);
        return ResponseEntity.ok(students);
    }
}

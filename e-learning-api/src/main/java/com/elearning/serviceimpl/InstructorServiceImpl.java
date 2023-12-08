package com.elearning.serviceimpl;

import com.elearning.dto.AssignmentsDto;
import com.elearning.dto.CoursesDto;
import com.elearning.dto.InstructorDto;
import com.elearning.dto.SectionDto;
import com.elearning.entity.AssignmentsEntity;
import com.elearning.entity.CoursesEntity;
import com.elearning.entity.InstructorEntity;
import com.elearning.entity.SectionEntity;
import com.elearning.exception.InstructorNotFoundException;
import com.elearning.repository.AssignmentsRepository;
import com.elearning.repository.CoursesRepository;
import com.elearning.repository.InstructorRepository;
import com.elearning.repository.SectionRepository;
import com.elearning.service.InstructorService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InstructorServiceImpl implements InstructorService {

    @Autowired
    private InstructorRepository instructorRepository;
    @Autowired
    private SectionRepository sectionRepository;
    @Autowired
    private CoursesRepository coursesRepository;
    @Autowired
    private AssignmentsRepository assignmentsRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<InstructorDto> getInstructors() {
        List<InstructorEntity> instructors = instructorRepository.findAll();
        return instructors.stream().map(instructorEntity -> modelMapper.map(instructorEntity, InstructorDto.class)).collect(Collectors.toList());
    }

    @Override
    public Optional<InstructorDto> getInstructor(String id) throws InstructorNotFoundException {
        Optional<InstructorEntity> instructorEntity = instructorRepository.findById(id);
        if (instructorEntity.isEmpty()) {
            throw new InstructorNotFoundException("Instructor not found");
        } else {
            return Optional.of(modelMapper.map(instructorEntity.get(), InstructorDto.class));
        }
    }

    @Override
    public InstructorDto addInstructor(InstructorDto instructorDto) {
        InstructorEntity instructorEntity = modelMapper.map(instructorDto, InstructorEntity.class);
        InstructorEntity savedInstructorEntity = instructorRepository.save(instructorEntity);
        return modelMapper.map(savedInstructorEntity, InstructorDto.class);
    }

    @Override
    public Optional<InstructorDto> updateInstructor(String id, InstructorDto updatedInstructorDto) throws InstructorNotFoundException {
        Optional<InstructorEntity> existingInstructorEntity = instructorRepository.findById(id);
        if (existingInstructorEntity.isEmpty()) throw new InstructorNotFoundException("Instructor not found");

        InstructorEntity updatedInstructorEntity = modelMapper.map(updatedInstructorDto, InstructorEntity.class);
        updatedInstructorEntity.setInstructorId(id);
        instructorRepository.save(updatedInstructorEntity);

        return Optional.of(modelMapper.map(updatedInstructorEntity, InstructorDto.class));
    }

    @Override
    public void deleteInstructor(String id) throws InstructorNotFoundException {
        Optional<InstructorEntity> existingInstructorEntity = instructorRepository.findById(id);
        if (existingInstructorEntity.isEmpty()) throw new InstructorNotFoundException("Instructor not found");

        instructorRepository.deleteById(id);
    }

    @Override
    public InstructorDto findByEmail(String email) throws InstructorNotFoundException {
        InstructorEntity instructorEntity = instructorRepository.findByEmail(email)
                .orElseThrow(() -> new InstructorNotFoundException("Unknown user"));

        return modelMapper.map(instructorEntity, InstructorDto.class);
    }

    @Override
    public InstructorDto login(InstructorDto instructorDto) {
        InstructorEntity instructorEntity = instructorRepository.findByEmail(instructorDto.getEmail())
                .orElseThrow(() -> new InstructorNotFoundException("not found"));
        if (instructorEntity.getPassword().equals(instructorDto.getPassword())) {
            InstructorDto finalInstructorDetails = modelMapper.map(instructorEntity, InstructorDto.class);
            finalInstructorDetails.setPassword(null);
            finalInstructorDetails.setRole("ROLE_INSTRUCTOR");
            return finalInstructorDetails;
        }
        throw new InstructorNotFoundException("Invalid password");
    }

    @Override
    public List<SectionDto> getInstructorCourses(String id) {
        List<SectionEntity> sections = sectionRepository.findAllByInstructorId(id);
        List<SectionDto> sectionDtos = new ArrayList<>();

        for (SectionEntity sectionEntity : sections) {
            CoursesEntity courseEntity = coursesRepository.findById(sectionEntity.getCourseId()).orElse(null);
            if (courseEntity != null) {
                SectionDto sectionDto = modelMapper.map(sectionEntity, SectionDto.class);

                CoursesDto courseDto = new CoursesDto();
                courseDto.setCourseId(courseEntity.getCourseId());
                // courseDto.setDepartmentId(courseEntity.getDepartmentId());
                courseDto.setCourseCode(courseEntity.getCourseCode());
                courseDto.setTitle(courseEntity.getTitle());
                courseDto.setDescription(courseEntity.getDescription());
                courseDto.setCreditHours(courseEntity.getCreditHours());

                sectionDto.setCourse(courseDto);
                sectionDtos.add(sectionDto);
            }
        }
        return sectionDtos;
    }

    @Override
    public List<AssignmentsDto> getSectionAssignments(String id, String sectionId) {
        List<AssignmentsEntity> assignments = assignmentsRepository.findAllBySectionId(sectionId);
        return assignments.stream().map(assignmentEntity -> modelMapper.map(assignmentEntity, AssignmentsDto.class)).collect(Collectors.toList());
    }

    @Override
    public AssignmentsDto saveSectionAssignments(String id, String sectionId, AssignmentsDto assignmentDto) {
        return null;
    }

    @Override
    public AssignmentsDto updateSectionAssignments(String id, String sectionId, AssignmentsDto assignmentDto) {
        return null;
    }
}

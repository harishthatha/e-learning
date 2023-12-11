package com.elearning.serviceimpl;

import com.elearning.dto.*;
import com.elearning.entity.AssignmentsEntity;
import com.elearning.entity.CoursesEntity;
import com.elearning.entity.EnrollmentEntity;
import com.elearning.entity.SectionEntity;
import com.elearning.exception.BaseException;
import com.elearning.exception.SectionNotFoundException;
import com.elearning.repository.*;
import com.elearning.service.SectionService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SectionServiceImpl implements SectionService {

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private CoursesRepository courseRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AssignmentsRepository assignmentRepository;
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<SectionDto> getSections() {
        List<SectionEntity> sections = sectionRepository.findAll();
        List<SectionDto> sectionDtos = new ArrayList<>();

        for (SectionEntity sectionEntity : sections) {
            CoursesEntity courseEntity = courseRepository.findById(sectionEntity.getCourseId()).orElse(null);
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
    public Optional<SectionDto> getSection(String id) throws SectionNotFoundException {
        Optional<SectionEntity> sectionEntity = sectionRepository.findById(id);
        if (sectionEntity.isEmpty()) {
            throw new SectionNotFoundException("Section not found");
        } else {
            SectionEntity section = sectionEntity.get();
            CoursesEntity courseEntity = courseRepository.findById(section.getCourseId()).orElse(null);
            SectionDto sectionDto = modelMapper.map(section, SectionDto.class);
            if (courseEntity != null) {
                CoursesDto courseDto = new CoursesDto();
                courseDto.setCourseId(courseEntity.getCourseId());
                // courseDto.setDepartmentId(courseEntity.getDepartmentId());
                courseDto.setCourseCode(courseEntity.getCourseCode());
                courseDto.setTitle(courseEntity.getTitle());
                courseDto.setDescription(courseEntity.getDescription());
                courseDto.setCreditHours(courseEntity.getCreditHours());

                sectionDto.setCourse(courseDto);
            }
            return Optional.of(sectionDto);
        }
    }

    @Override
    public List<SectionDto> addSection(SectionDto sectionDto) {
        List<SectionDto> savedSections = new ArrayList<>();

        if (sectionDto.getListOfDays().size() > 0) {
            for (String day : sectionDto.getListOfDays()) {
                sectionDto.setDay(day);

                if (isDayTimeConflict(sectionDto)) {
                    throw new BaseException(
                            "Oops! It seems there's a scheduling conflict for the section \"" + sectionDto.getDay() +
                                    "\" with the instructor on " + day + ". Please choose a different day and time.");
                }

                SectionEntity sectionEntity = modelMapper.map(sectionDto, SectionEntity.class);

                Optional<CoursesEntity> courseEntity = courseRepository.findById(sectionDto.getCourseId());
                if (courseEntity.isEmpty())
                    throw new BaseException("Course not found.");

                SectionEntity sectionData = sectionRepository.findFirstByOrderBySectionCodeDesc();
                int crn = sectionData == null ? 50000 : sectionData.getSectionCode() + 1;
                sectionEntity.setSectionCode(crn);
                sectionEntity.setListOfStudents(new ArrayList<>());

                sectionEntity.setDay(sectionDto.getDay());
                sectionEntity.setStartTime(sectionDto.getStartTime());
                sectionEntity.setEndTime(sectionDto.getEndTime());
                sectionEntity.setCreditHours(courseEntity.get().getCreditHours());
                sectionEntity.setAvailableSeats(sectionDto.getMaxStrength());
                sectionEntity.setTotalSeats(sectionDto.getMaxStrength());

                SectionEntity savedSectionEntity = sectionRepository.save(sectionEntity);
                savedSections.add(modelMapper.map(savedSectionEntity, SectionDto.class));

            }

            return savedSections;
        }

        throw new BaseException("At least one day should be selected");
    }

    private boolean isDayTimeConflict(SectionDto sectionDto) {
        // Fetch sections for the instructor
        List<SectionEntity> instructorSections = sectionRepository.findByInstructorId(sectionDto.getInstructorId());

        // Check for conflicts
        for (SectionEntity instructorSection : instructorSections) {
            if (instructorSection != null && instructorSection.getSectionId() != null
                    && instructorSection.getSectionId().equals(sectionDto.getSectionId())) {
                continue;
            }

            if (instructorSection != null && instructorSection.getDay().equals(sectionDto.getDay()) &&
                    doTimeRangesOverlap(instructorSection.getStartTime(), instructorSection.getEndTime(),
                            sectionDto.getStartTime(), sectionDto.getEndTime())) {
                return true; // Conflict detected
            }
        }

        return false; // No conflicts
    }

    private boolean doTimeRangesOverlap(String startTime1, String endTime1, String startTime2, String endTime2) {
        // Convert time strings to LocalTime objects
        LocalTime start1 = LocalTime.parse(startTime1);
        LocalTime end1 = LocalTime.parse(endTime1);
        LocalTime start2 = LocalTime.parse(startTime2);
        LocalTime end2 = LocalTime.parse(endTime2);

        // Check for overlap
        return !start1.isAfter(end2) && !start2.isAfter(end1);
    }

    @Override
    public List<SectionDto> updateSection(String id, SectionDto sectionDto) throws SectionNotFoundException {
        List<SectionDto> updatedSections = new ArrayList<>();

        Optional<CoursesEntity> courseEntity = courseRepository.findById(sectionDto.getCourseId());
        if (courseEntity.isEmpty())
            throw new BaseException("Course not found");

        if (sectionDto.getListOfDays().size() > 0) {
            for (String day : sectionDto.getListOfDays()) {
                sectionDto.setDay(day);

                if (isDayTimeConflict(sectionDto)) {
                    throw new BaseException(
                            "Oops! It seems there's a scheduling conflict for the section \"" + sectionDto.getName() +
                                    "\" with the instructor on " + day + ". Please choose a different day and time.");
                }

                Optional<SectionEntity> existingSectionEntity = sectionRepository.findById(id);
                if (existingSectionEntity.isEmpty())
                    throw new SectionNotFoundException("Section not found");

                SectionEntity updatedSectionEntity = existingSectionEntity.get();
                updatedSectionEntity.setMaxStrength(sectionDto.getMaxStrength());
                updatedSectionEntity.setInstructorId(sectionDto.getInstructorId());
                updatedSectionEntity.setName(sectionDto.getName());
                updatedSectionEntity.setClassroomNumber(sectionDto.getClassroomNumber());

                updatedSectionEntity.setDay(sectionDto.getDay());
                updatedSectionEntity.setStartTime(sectionDto.getStartTime());
                updatedSectionEntity.setEndTime(sectionDto.getEndTime());
                updatedSectionEntity.setCreditHours(courseEntity.get().getCreditHours());
                if (sectionDto.getMaxStrength() < updatedSectionEntity.getAvailableSeats()) {
                    updatedSectionEntity.setAvailableSeats(sectionDto.getMaxStrength());
                }
                updatedSectionEntity.setTotalSeats(sectionDto.getMaxStrength());

                sectionRepository.save(updatedSectionEntity);

                updatedSections.add(modelMapper.map(updatedSectionEntity, SectionDto.class));
            }

            return updatedSections;
        }

        throw new BaseException("At least one day should be selected");
    }

    @Override
    public void deleteSection(String id) throws SectionNotFoundException {
        Optional<SectionEntity> existingSectionEntity = sectionRepository.findById(id);
        if (existingSectionEntity.isEmpty())
            throw new SectionNotFoundException("Section not found");

        sectionRepository.deleteById(id);
    }

    @Override
    public List<StudentDto> getSectionStudents(String id) {
        Optional<SectionEntity> section = sectionRepository.findById(id);
        if (section.isEmpty())
            throw new SectionNotFoundException("Section not found");

        List<AssignmentsEntity> assignments = assignmentRepository.findAllBySectionId(id);
        List<AssignmentsDto> assignmentDtos = assignments.stream()
                .map(assignmentEntity -> modelMapper.map(assignmentEntity, AssignmentsDto.class))
                .toList();

        return studentRepository
                .findAllByStudentIdIn(section.get().getListOfStudents())
                .stream()
                .map(studentEntity -> {
                    EnrollmentEntity enrollment = enrollmentRepository
                            .findByStudentIdAndSectionId(studentEntity.getStudentId(), id);
                    StudentDto studentDto = modelMapper.map(studentEntity, StudentDto.class);

                    // Create a new list for each student to avoid sharing
                    // List<AssignmentsDto> updatedAssignmentsDtos = assignmentDtos.stream()
                    // .map(assignmentDto -> {
                    // // Check if the student has submitted for this assignment
                    // boolean submitted = assignmentDto.getSubmittedStudents() != null &&
                    // assignmentDto.getSubmittedStudents().contains(studentDto.getStudentId());
                    // AssignmentsDto updatedAssignmentsDto = new AssignmentsDto();
                    // updatedAssignmentsDto.setAssignmentId(assignmentDto.getAssignmentId());
                    // updatedAssignmentsDto.setSectionId(assignmentDto.getSectionId());
                    // updatedAssignmentsDto.setTitle(assignmentDto.getTitle());
                    // updatedAssignmentsDto.setDescription(assignmentDto.getDescription());
                    // updatedAssignmentsDto.setSubmittedStudents(assignmentDto.getSubmittedStudents());
                    // updatedAssignmentsDto.setDueDate(assignmentDto.getDueDate());
                    // updatedAssignmentsDto.setAssignmentMarks(assignmentDto.getAssignmentMarks());
                    // updatedAssignmentsDto.setAssignmentDetails(assignmentDto.getAssignmentDetails());
                    // updatedAssignmentsDto.setSubmissionStatus(submitted ? "Submitted" : "Not
                    // Submitted");
                    // return updatedAssignmentsDto;
                    // })
                    // .toList();
                    //
                    // studentDto.setAssignmentsDtos(updatedAssignmentsDtos);
                    if (enrollment != null)
                        studentDto.setEnrollmentDto(modelMapper.map(enrollment, EnrollmentDto.class));
                    return studentDto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<AssignmentsDto> getSectionAssignments(String id) {
        List<AssignmentsEntity> assignments = assignmentRepository.findAllBySectionId(id);
        return assignments.stream().map(assignmentEntity -> modelMapper.map(assignmentEntity, AssignmentsDto.class))
                .collect(Collectors.toList());
    }
}

package com.elearning.serviceimpl;

import com.elearning.dto.*;
import com.elearning.entity.*;
import com.elearning.exception.AssignmentsNotFoundException;
import com.elearning.exception.BaseException;
import com.elearning.exception.SectionNotFoundException;
import com.elearning.exception.StudentNotFoundException;
import com.elearning.repository.*;
import com.elearning.service.SectionService;
import com.elearning.service.StudentService;
import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SectionRepository sectionRepository;
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    @Autowired
    private AssignmentsRepository assignmentsRepository;
    @Autowired
    private SubmissionRepository submissionRepository;


    @Autowired
    private SectionService sectionServiceImpl;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<StudentDto> getStudents() {
        List<StudentEntity> students = studentRepository.findAll();
        return students.stream().map(studentEntity -> modelMapper.map(studentEntity, StudentDto.class)).collect(Collectors.toList());
    }

    @Override
    public Optional<StudentDto> getStudent(String id) throws StudentNotFoundException {
        Optional<StudentEntity> studentEntity = studentRepository.findById(id);
        if (studentEntity.isEmpty()) {
            throw new StudentNotFoundException("Student not found");
        } else {
            return Optional.of(modelMapper.map(studentEntity.get(), StudentDto.class));
        }
    }

//    @Override
//    public StudentDto addStudent(StudentDto studentDto) {
//        StudentEntity studentEntity = modelMapper.map(studentDto, StudentEntity.class);
//        StudentEntity savedStudentEntity = studentRepository.save(studentEntity);
//        return modelMapper.map(savedStudentEntity, StudentDto.class);
//    }

    @Override
    public StudentDto addStudent(StudentDto studentDto) {
        // Generate unique studentIdCode
        String studentIdCode = generateStudentIdCode();

        // Set the generated studentIdCode to the studentDto
        studentDto.setStudentIdNumber(studentIdCode);

        // Map DTO to Entity
        StudentEntity studentEntity = modelMapper.map(studentDto, StudentEntity.class);

        // Save the studentEntity
        StudentEntity savedStudentEntity = studentRepository.save(studentEntity);

        // Map the saved entity back to DTO
        return modelMapper.map(savedStudentEntity, StudentDto.class);
    }

    private String generateStudentIdCode() {
        // Fetch the maximum student ID from the database
        Optional<StudentEntity> maxStudentIdNumberStudent = studentRepository.findFirstByOrderByStudentIdNumberDesc();

        // If no records are found, start with the default prefix
        int nextId = maxStudentIdNumberStudent.isPresent() && maxStudentIdNumberStudent.get().getStudentIdNumber() != null
                ? Integer.parseInt(maxStudentIdNumberStudent.get().getStudentIdNumber().substring(3)) + 1 : 0;

        // Format the new studentIdCode
        return "700" + String.format("%06d", nextId);
    }

    @Override
    public Optional<StudentDto> updateStudent(String id, StudentDto updatedStudentDto) throws StudentNotFoundException {
        Optional<StudentEntity> existingStudentEntity = studentRepository.findById(id);
        if (existingStudentEntity.isEmpty()) throw new StudentNotFoundException("Student not found");

        StudentEntity updatedStudentEntity = modelMapper.map(updatedStudentDto, StudentEntity.class);
        updatedStudentEntity.setStudentId(id);
        studentRepository.save(updatedStudentEntity);

        return Optional.of(modelMapper.map(updatedStudentEntity, StudentDto.class));
    }

    @Override
    public void deleteStudent(String id) throws StudentNotFoundException {
        Optional<StudentEntity> existingStudentEntity = studentRepository.findById(id);
        if (existingStudentEntity.isEmpty()) throw new StudentNotFoundException("Student not found");

        studentRepository.deleteById(id);
    }

    @Override
    public StudentDto findByEmail(String email) throws StudentNotFoundException {
        StudentEntity studentEntity = studentRepository.findByEmail(email)
                .orElseThrow(() -> new StudentNotFoundException("Unknown user"));
        return modelMapper.map(studentEntity, StudentDto.class);
    }

    @Override
    public StudentDto login(StudentDto studentDto) {
        StudentEntity studentEntity = studentRepository.findByEmail(studentDto.getEmail())
                .orElseThrow(() -> new StudentNotFoundException("Student not found"));
        if (studentEntity.getPassword() != null && studentEntity.getPassword().equals(studentDto.getPassword())) {
            StudentDto finalStudentDetails = modelMapper.map(studentEntity, StudentDto.class);
            finalStudentDetails.setPassword(null);
            finalStudentDetails.setRole("ROLE_STUDENT");
            return finalStudentDetails;
        }
        throw new StudentNotFoundException("Invalid password");
    }

    @Override
    public List<SectionDto> getStudentEnrolledClasses(String studentId) {
        List<SectionEntity> enrolledSections = sectionRepository.findSectionsByStudentId(studentId);
        List<SectionDto> sectionDtos = sectionServiceImpl.getSections();

        return enrolledSections.stream()
                .map(enrolledSection ->
                        sectionDtos.stream()
                                .filter(sectionDto -> enrolledSection.getSectionId().equals(sectionDto.getSectionId()))
                                .findFirst()
                                .orElse(null)
                )
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDto enrollStudentClasses(String studentId, List<String> sectionIds) {
        // Assuming studentId is used to identify the student

        Optional<StudentEntity> existingStudentEntity = studentRepository.findById(studentId);
        if (existingStudentEntity.isEmpty()) throw new StudentNotFoundException("Student not found");

        if (hasDayTimeConflict(sectionIds)) {
            throw new BaseException("Oops! It seems there's a scheduling conflict for the sections. Please choose a different day and time.");
        }

        StudentEntity studentEntity = existingStudentEntity.get();

        // Get the list of previously enrolled sections
        List<SectionEntity> previouslyEnrolledSections = sectionRepository.findSectionsByStudentId(studentId);
        List<EnrollmentEntity> prevEnrollmentEntities = new ArrayList<>();

        if (previouslyEnrolledSections.size() > 0) {
            // Update previouslyEnrolledSections by removing student id from the list of students in these sections
            previouslyEnrolledSections.forEach(sectionEntity -> {
                sectionEntity.getListOfStudents().remove(studentId);
                EnrollmentEntity enrollment = enrollmentRepository.findByStudentIdAndSectionId(studentId, sectionEntity.getSectionId());
                if (enrollment != null) prevEnrollmentEntities.add(enrollment);
            });
        }
        enrollmentRepository.deleteAll(prevEnrollmentEntities);
        sectionRepository.saveAll(previouslyEnrolledSections);

        // Get the sections by sectionIds and update those sections' list of students by adding the student id in those sections and save them
        List<SectionEntity> sectionsToUpdate = sectionIds.stream()
                .map(sectionId -> sectionRepository.findById(sectionId)
                        .orElseThrow(() -> new SectionNotFoundException("Section not found: " + sectionId)))
                .collect(Collectors.toList());
        List<EnrollmentEntity> enrollmentEntities = new ArrayList<>();

        if (sectionsToUpdate.size() > 0) {
            sectionsToUpdate.forEach(sectionEntity -> {
                if (sectionEntity.getListOfStudents() == null) {
                    List<String> studentIds = new ArrayList<>();
                    studentIds.add(studentId);
                    sectionEntity.setListOfStudents(studentIds);
                } else if (!sectionEntity.getListOfStudents().contains(studentId)) {
                    sectionEntity.getListOfStudents().add(studentId);
                }

                EnrollmentEntity enrollmentEntity = new EnrollmentEntity();
                enrollmentEntity.setStudentId(studentId);
                enrollmentEntity.setCrn(sectionEntity.getSectionCode());
                enrollmentEntity.setSectionId(sectionEntity.getSectionId());
                enrollmentEntity.setEnrollmentDate(LocalDate.now());
                enrollmentEntities.add(enrollmentEntity);
            });

            enrollmentRepository.saveAll(enrollmentEntities);
            sectionRepository.saveAll(sectionsToUpdate);
        }

        return modelMapper.map(studentEntity, StudentDto.class);
    }

    @Override
    public EnrollmentDto getStudentEnrollment(String id, String sectionId) {
        EnrollmentEntity enrollmentEntity = enrollmentRepository.findByStudentIdAndSectionId(id, sectionId);
        return modelMapper.map(enrollmentEntity, EnrollmentDto.class);
    }

    @Override
    public AssignmentsDto submitAssignment(String studentId, String sectionId, String assignmentId, MultipartFile assignmentFile) {
        if (assignmentFile.isEmpty()) {
            throw new IllegalArgumentException("Assignment file is empty");
        }

        AssignmentsEntity assignmentEntity = assignmentsRepository.findById(assignmentId)
                .orElseThrow(() -> new AssignmentsNotFoundException("Assignment not found"));

        Optional<SubmissionEntity> existingSubmission = submissionRepository
                .findBySectionIdAndStudentIdAndAssignmentId(sectionId, studentId, assignmentId);

        LocalDateTime currentDateTime = LocalDateTime.now();

        // Format the date and time as a string
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedDateTime = currentDateTime.format(formatter);

        String uniqueFileName = handleFileUpload(studentId, assignmentEntity, assignmentFile);

        SubmissionEntity submissionEntity;
        if (existingSubmission.isPresent()) {
            submissionEntity = existingSubmission.get();
        } else {
            // If no existing submission, create a new entity
            submissionEntity = new SubmissionEntity();
            submissionEntity.setSubmissionId(new ObjectId().toString());
        }

        submissionEntity.setFileUrl(uniqueFileName);
        submissionEntity.setDateTime(formattedDateTime);
        submissionEntity.setStudentId(studentId);
        submissionEntity.setAssignmentId(assignmentId);
        submissionEntity.setSectionId(sectionId);
        submissionEntity.setStatus("Submitted");

        // Save the submission entity
        submissionRepository.save(submissionEntity);

        return modelMapper.map(assignmentEntity, AssignmentsDto.class);
    }


    @Override
    public AssignmentsDto addMarksToAssignment(String id, String assignmentId, int marks) {
//        AssignmentsEntity assignmentEntity = assignmentsRepository.findById(assignmentId)
//                .orElseThrow(() -> new AssignmentsNotFoundException("Assignment not found"));
//
//        if (assignmentEntity.getAssignmentDetails() != null &&
//                assignmentEntity.getAssignmentDetails().size() > 0) {
//            assignmentEntity.getAssignmentDetails().forEach(assignmentDetDto -> {
//                if (assignmentDetDto.getStudentId().equals(id)) {
//                    assignmentDetDto.setMarks(marks);
//                }
//            });
//        }
//
//        assignmentsRepository.save(assignmentEntity);
//        return modelMapper.map(assignmentEntity, AssignmentsDto.class);
        return null;
    }


    @Override
    public List<AssignmentsDto> getStudentAssignments(String id, String sectionId) {
        List<AssignmentsEntity> assignments = assignmentsRepository.findAllBySectionId(sectionId);

        EnrollmentEntity enrollment = enrollmentRepository.findByStudentIdAndSectionId(id, sectionId);

        return assignments.stream().map(assignmentEntity -> {
                    Optional<SubmissionEntity> existingSubmission = submissionRepository
                            .findBySectionIdAndStudentIdAndAssignmentId(sectionId, id, assignmentEntity.getAssignmentId());
                    AssignmentsDto assignmentsDto = modelMapper.map(assignmentEntity, AssignmentsDto.class);
                    existingSubmission.ifPresent(submissionEntity -> assignmentsDto.setSubmission(modelMapper.map(submissionEntity, SubmissionDto.class)));
                    if (enrollment != null) assignmentsDto.setEnrollment(modelMapper.map(enrollment, EnrollmentDto.class));
                    return assignmentsDto;

                }
        ).collect(Collectors.toList());
    }


    private String handleFileUpload(String studentId, AssignmentsEntity assignmentEntity, MultipartFile assignmentFile) {
        String uniqueFileName = "";
        try {
            String uploadDir = "/Users/harishthatha/Documents/GitHub/e-learning/e-learning-ui/src/assignments-upload";
            String originalFileName = assignmentFile.getOriginalFilename();
            assert originalFileName != null;
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            uniqueFileName = studentId + "-" + assignmentEntity.getAssignmentId() + fileExtension;

            Path filePath = Paths.get(uploadDir, uniqueFileName);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }

            Files.write(filePath, assignmentFile.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return uniqueFileName;
    }

    private boolean hasDayTimeConflict(List<String> sectionIds) {
        List<SectionEntity> studentSections = sectionRepository.findAllById(sectionIds);

        for (int i = 0; i < studentSections.size() - 1; i++) {
            for (int j = i + 1; j < studentSections.size(); j++) {
                if (studentSections.get(i) != null && studentSections.get(j) != null &&
                        studentSections.get(i).getDay().equals(studentSections.get(j).getDay()) &&
                        doTimeRangesOverlap(studentSections.get(i).getStartTime(), studentSections.get(i).getEndTime(),
                                studentSections.get(j).getStartTime(), studentSections.get(j).getEndTime())) {
                    return true; // Conflict detected
                }
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
}

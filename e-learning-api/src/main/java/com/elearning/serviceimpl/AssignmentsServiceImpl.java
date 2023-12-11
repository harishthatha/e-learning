package com.elearning.serviceimpl;

import com.elearning.dto.AssignmentsDto;
import com.elearning.entity.AssignmentsEntity;
import com.elearning.exception.AssignmentsNotFoundException;
import com.elearning.repository.AssignmentsRepository;
import com.elearning.service.AssignmentsService;
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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AssignmentsServiceImpl implements AssignmentsService {

    @Autowired
    private AssignmentsRepository assignmentsRepository;

    @Autowired
    private StudentService studentService;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<AssignmentsDto> getAssignments() {
        List<AssignmentsEntity> assignments = assignmentsRepository.findAll();
        return assignments.stream().map(assignmentsEntity -> modelMapper.map(assignmentsEntity, AssignmentsDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<AssignmentsDto> getAssignment(String id) throws AssignmentsNotFoundException {
        Optional<AssignmentsEntity> assignmentsEntity = assignmentsRepository.findById(id);
        if (assignmentsEntity.isEmpty()) {
            throw new AssignmentsNotFoundException("Assignment not found");
        } else {
            return Optional.of(modelMapper.map(assignmentsEntity.get(), AssignmentsDto.class));
        }
    }

    @Override
    public AssignmentsDto addAssignment(AssignmentsDto assignmentsDto) {
        String id = new ObjectId().toString();
        AssignmentsEntity assignmentsEntity = modelMapper.map(assignmentsDto, AssignmentsEntity.class);

        String attachmentUrl = "";
        if (assignmentsDto.getAttachment() != null) {
            attachmentUrl = handleFileUpload(assignmentsDto.getTitle(), id, assignmentsDto.getAttachment());
        }

        assignmentsEntity.setAttachmentUrl(attachmentUrl);
        assignmentsEntity.setAssignmentId(id);

        AssignmentsEntity savedAssignmentsEntity = assignmentsRepository.save(assignmentsEntity);
        return modelMapper.map(savedAssignmentsEntity, AssignmentsDto.class);
    }

    @Override
    public Optional<AssignmentsDto> updateAssignment(String id, AssignmentsDto updatedAssignmentsDto)
            throws AssignmentsNotFoundException {
        Optional<AssignmentsEntity> existingAssignmentsEntity = assignmentsRepository.findById(id);
        if (existingAssignmentsEntity.isEmpty())
            throw new AssignmentsNotFoundException("Assignment not found");

        String attachmentUrl = "";
        if (updatedAssignmentsDto.getAttachment() != null) {
            attachmentUrl = handleFileUpload(updatedAssignmentsDto.getTitle(), id,
                    updatedAssignmentsDto.getAttachment());
        }

        AssignmentsEntity updatedAssignmentsEntity = modelMapper.map(updatedAssignmentsDto, AssignmentsEntity.class);
        if (updatedAssignmentsDto.getAttachment() != null) {
            updatedAssignmentsEntity.setAttachmentUrl(attachmentUrl);
        }
        updatedAssignmentsEntity.setAssignmentId(id);
        assignmentsRepository.save(updatedAssignmentsEntity);

        return Optional.of(modelMapper.map(updatedAssignmentsEntity, AssignmentsDto.class));
    }

    @Override
    public void deleteAssignment(String id) throws AssignmentsNotFoundException {
        Optional<AssignmentsEntity> existingAssignmentsEntity = assignmentsRepository.findById(id);
        if (existingAssignmentsEntity.isEmpty())
            throw new AssignmentsNotFoundException("Assignment not found");

        assignmentsRepository.deleteById(id);
    }

    @Override
    public List<AssignmentsDto> getSectionAssignments(String sectionId) {
        List<AssignmentsEntity> assignments = assignmentsRepository.findAllBySectionId(sectionId);
        return assignments.stream().map(assignmentEntity -> modelMapper.map(assignmentEntity, AssignmentsDto.class))
                .collect(Collectors.toList());
    }

    private String handleFileUpload(String title, String assignmentId, MultipartFile assignmentFile) {
        String uniqueFileName = "";
        try {
            String uploadDir = "/Documents/GitHub/e-learning/e-learning-ui/src/assignments-upload";
            String originalFileName = assignmentFile.getOriginalFilename();
            assert originalFileName != null;
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            uniqueFileName = assignmentId + "-" + title + fileExtension;

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
}

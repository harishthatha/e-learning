package com.elearning.serviceimpl;

import com.elearning.dto.AssignmentsDto;
import com.elearning.entity.AssignmentsEntity;
import com.elearning.exception.AssignmentsNotFoundException;
import com.elearning.repository.AssignmentsRepository;
import com.elearning.service.AssignmentsService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AssignmentsServiceImpl implements AssignmentsService {

    @Autowired
    private AssignmentsRepository assignmentsRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<AssignmentsDto> getAssignments() {
        List<AssignmentsEntity> assignments = assignmentsRepository.findAll();
        return assignments.stream().map(assignmentsEntity -> modelMapper.map(assignmentsEntity, AssignmentsDto.class)).collect(Collectors.toList());
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
        AssignmentsEntity assignmentsEntity = modelMapper.map(assignmentsDto, AssignmentsEntity.class);
        AssignmentsEntity savedAssignmentsEntity = assignmentsRepository.save(assignmentsEntity);
        return modelMapper.map(savedAssignmentsEntity, AssignmentsDto.class);
    }

    @Override
    public Optional<AssignmentsDto> updateAssignment(String id, AssignmentsDto updatedAssignmentsDto) throws AssignmentsNotFoundException {
        Optional<AssignmentsEntity> existingAssignmentsEntity = assignmentsRepository.findById(id);
        if (existingAssignmentsEntity.isEmpty()) throw new AssignmentsNotFoundException("Assignment not found");

        AssignmentsEntity updatedAssignmentsEntity = modelMapper.map(updatedAssignmentsDto, AssignmentsEntity.class);
        updatedAssignmentsEntity.setAssignmentId(id);
        assignmentsRepository.save(updatedAssignmentsEntity);

        return Optional.of(modelMapper.map(updatedAssignmentsEntity, AssignmentsDto.class));
    }

    @Override
    public void deleteAssignment(String id) throws AssignmentsNotFoundException {
        Optional<AssignmentsEntity> existingAssignmentsEntity = assignmentsRepository.findById(id);
        if (existingAssignmentsEntity.isEmpty()) throw new AssignmentsNotFoundException("Assignment not found");

        assignmentsRepository.deleteById(id);
    }

    @Override
    public List<AssignmentsDto> getSectionAssignments(String sectionId) {
        List<AssignmentsEntity> assignments = assignmentsRepository.findAllBySectionId(sectionId);
        return assignments.stream().map(assignmentEntity ->
                modelMapper.map(assignmentEntity, AssignmentsDto.class)).collect(Collectors.toList());
    }
}

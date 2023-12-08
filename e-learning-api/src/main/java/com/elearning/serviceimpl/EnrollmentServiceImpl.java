package com.elearning.serviceimpl;

import com.elearning.dto.EnrollmentDto;
import com.elearning.entity.EnrollmentEntity;
import com.elearning.exception.EnrollmentNotFoundException;
import com.elearning.repository.EnrollmentRepository;
import com.elearning.service.EnrollmentService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<EnrollmentDto> getEnrollments() {
        List<EnrollmentEntity> enrollments = enrollmentRepository.findAll();
        return enrollments.stream().map(enrollmentEntity -> modelMapper.map(enrollmentEntity, EnrollmentDto.class)).collect(Collectors.toList());
    }

    @Override
    public Optional<EnrollmentDto> getEnrollment(String id) throws EnrollmentNotFoundException {
        Optional<EnrollmentEntity> enrollmentEntity = enrollmentRepository.findById(id);
        if (enrollmentEntity.isEmpty()) {
            throw new EnrollmentNotFoundException("Enrollment not found");
        } else {
            return Optional.of(modelMapper.map(enrollmentEntity.get(), EnrollmentDto.class));
        }
    }

    @Override
    public EnrollmentDto addEnrollment(EnrollmentDto enrollmentDto) {
        EnrollmentEntity enrollmentEntity = modelMapper.map(enrollmentDto, EnrollmentEntity.class);
        EnrollmentEntity savedEnrollmentEntity = enrollmentRepository.save(enrollmentEntity);
        return modelMapper.map(savedEnrollmentEntity, EnrollmentDto.class);
    }

    @Override
    public Optional<EnrollmentDto> updateEnrollment(String id, EnrollmentDto updatedEnrollmentDto) throws EnrollmentNotFoundException {
        Optional<EnrollmentEntity> existingEnrollmentEntity = enrollmentRepository.findById(id);
        if (existingEnrollmentEntity.isEmpty()) throw new EnrollmentNotFoundException("Enrollment not found");

        EnrollmentEntity updatedEnrollmentEntity = modelMapper.map(updatedEnrollmentDto, EnrollmentEntity.class);
        updatedEnrollmentEntity.setEnrollmentId(id);
        enrollmentRepository.save(updatedEnrollmentEntity);

        return Optional.of(modelMapper.map(updatedEnrollmentEntity, EnrollmentDto.class));
    }

    @Override
    public void deleteEnrollment(String id) throws EnrollmentNotFoundException {
        Optional<EnrollmentEntity> existingEnrollmentEntity = enrollmentRepository.findById(id);
        if (existingEnrollmentEntity.isEmpty()) throw new EnrollmentNotFoundException("Enrollment not found");

        enrollmentRepository.deleteById(id);
    }

    @Override
    public Optional<EnrollmentDto> updateFinalGrade(String id, EnrollmentDto updatedEnrollmentDto) {
        Optional<EnrollmentEntity> existingEnrollmentEntity = enrollmentRepository.findById(id);
        if (existingEnrollmentEntity.isEmpty()) throw new EnrollmentNotFoundException("Enrollment not found");

        EnrollmentEntity updatedEnrollmentEntity = existingEnrollmentEntity.get();
        updatedEnrollmentEntity.setGrade(updatedEnrollmentDto.getGrade());
        updatedEnrollmentEntity.setEnrollmentId(id);
        enrollmentRepository.save(updatedEnrollmentEntity);

        return Optional.of(modelMapper.map(updatedEnrollmentEntity, EnrollmentDto.class));
    }
}

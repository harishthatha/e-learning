package com.elearning.serviceimpl;

import com.elearning.dto.SubmissionDto;
import com.elearning.entity.SubmissionEntity;
import com.elearning.exception.SubmissionNotFoundException;
import com.elearning.repository.SubmissionRepository;
import com.elearning.service.SubmissionService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubmissionServiceImpl implements SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<SubmissionDto> getSubmissions() {
        List<SubmissionEntity> submissions = submissionRepository.findAll();
        return submissions.stream().map(submissionEntity -> modelMapper.map(submissionEntity, SubmissionDto.class)).collect(Collectors.toList());
    }

    @Override
    public Optional<SubmissionDto> getSubmission(String id) throws SubmissionNotFoundException {
        Optional<SubmissionEntity> submissionEntity = submissionRepository.findById(id);
        if (submissionEntity.isEmpty()) {
            throw new SubmissionNotFoundException("Submission not found");
        } else {
            return Optional.of(modelMapper.map(submissionEntity.get(), SubmissionDto.class));
        }
    }

    @Override
    public SubmissionDto addSubmission(SubmissionDto submissionDto) {
        SubmissionEntity submissionEntity = modelMapper.map(submissionDto, SubmissionEntity.class);
        SubmissionEntity savedSubmissionEntity = submissionRepository.save(submissionEntity);
        return modelMapper.map(savedSubmissionEntity, SubmissionDto.class);
    }

    @Override
    public Optional<SubmissionDto> updateSubmission(String id, SubmissionDto updatedSubmissionDto) throws SubmissionNotFoundException {
        Optional<SubmissionEntity> existingSubmissionEntity = submissionRepository.findById(id);
        if (existingSubmissionEntity.isEmpty()) throw new SubmissionNotFoundException("Submission not found");

        SubmissionEntity updatedSubmissionEntity = modelMapper.map(updatedSubmissionDto, SubmissionEntity.class);
        updatedSubmissionEntity.setSubmissionId(id);
        submissionRepository.save(updatedSubmissionEntity);

        return Optional.of(modelMapper.map(updatedSubmissionEntity, SubmissionDto.class));
    }

    @Override
    public Optional<SubmissionDto> updateSubmissionPoints(String id, SubmissionDto updatedSubmissionDto) throws SubmissionNotFoundException {
        Optional<SubmissionEntity> existingSubmissionEntity = submissionRepository.findById(id);
        if (existingSubmissionEntity.isEmpty()) throw new SubmissionNotFoundException("Submission not found");

        SubmissionEntity updatedSubmissionEntity = existingSubmissionEntity.get();
        updatedSubmissionEntity.setPoints(updatedSubmissionDto.getPoints());
        updatedSubmissionEntity.setSubmissionId(id);
        submissionRepository.save(updatedSubmissionEntity);

        return Optional.of(modelMapper.map(updatedSubmissionEntity, SubmissionDto.class));
    }

    @Override
    public void deleteSubmission(String id) throws SubmissionNotFoundException {
        Optional<SubmissionEntity> existingSubmissionEntity = submissionRepository.findById(id);
        if (existingSubmissionEntity.isEmpty()) throw new SubmissionNotFoundException("Submission not found");

        submissionRepository.deleteById(id);
    }
}

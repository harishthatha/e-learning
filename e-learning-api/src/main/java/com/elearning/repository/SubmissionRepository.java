package com.elearning.repository;

import com.elearning.entity.SubmissionEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubmissionRepository extends MongoRepository<SubmissionEntity, String> {
    SubmissionEntity existsBySectionIdAndStudentIdAndAssignmentId(String sectionId, String studentId, String assignmentId);

    Optional<SubmissionEntity> findBySectionIdAndStudentIdAndAssignmentId(String sectionId, String studentId, String assignmentId);

    Optional<SubmissionEntity> findBySectionIdAndStudentId(String sectionId, String id);
    // Additional query methods if needed
}

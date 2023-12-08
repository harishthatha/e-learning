package com.elearning.repository;

import com.elearning.entity.EnrollmentEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnrollmentRepository extends MongoRepository<EnrollmentEntity, String> {

    EnrollmentEntity findByStudentIdAndSectionId(String studentId, String sectionId);
}

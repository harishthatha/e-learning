package com.elearning.repository;

import com.elearning.entity.AssignmentsEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentsRepository extends MongoRepository<AssignmentsEntity, String> {
    List<AssignmentsEntity> findAllBySectionId(String sectionId);
}

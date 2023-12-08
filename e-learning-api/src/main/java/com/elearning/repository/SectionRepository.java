package com.elearning.repository;

import com.elearning.entity.SectionEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends MongoRepository<SectionEntity, String> {

    SectionEntity findFirstByOrderBySectionCodeDesc();

    List<SectionEntity> findByCourseId(String id);

    List<SectionEntity> findByInstructorId(String instructorId);

    @Query(value = "{'listOfStudents': ?0}")
    List<SectionEntity> findSectionsByStudentId(String studentId);

    List<SectionEntity> findAllByInstructorId(String id);
}

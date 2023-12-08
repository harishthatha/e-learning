package com.elearning.repository;

import com.elearning.entity.StudentEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends MongoRepository<StudentEntity, String> {

    Optional<StudentEntity> findByEmail(String email);

    List<StudentEntity> findAllByStudentIdIn(List<String> studentIds);

    Optional<StudentEntity> findFirstByOrderByStudentIdNumberDesc();

}

package com.elearning.repository;

import com.elearning.entity.InstructorEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InstructorRepository extends MongoRepository<InstructorEntity, String> {
    Optional<InstructorEntity> findByEmail(String email);
}

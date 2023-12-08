package com.elearning.repository;

import com.elearning.entity.AdminEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends MongoRepository<AdminEntity, String> {
    Optional<AdminEntity> findByEmail(String email);
}

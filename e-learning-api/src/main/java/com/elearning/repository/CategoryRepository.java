package com.elearning.repository;

import com.elearning.entity.CategoryEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends MongoRepository<CategoryEntity, String> {
    // Define custom queries or methods related to categories if needed
}

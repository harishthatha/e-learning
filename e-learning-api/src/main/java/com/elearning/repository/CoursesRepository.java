package com.elearning.repository;

import com.elearning.entity.CoursesEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoursesRepository extends MongoRepository<CoursesEntity, String> {

    CoursesEntity findFirstByOrderByCourseCodeDesc();

    CoursesEntity findByTitle(String title);
}

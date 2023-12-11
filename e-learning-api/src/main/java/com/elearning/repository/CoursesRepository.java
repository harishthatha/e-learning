package com.elearning.repository;

import com.elearning.entity.CoursesEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CoursesRepository extends MongoRepository<CoursesEntity, String> {

    CoursesEntity findFirstByOrderByCourseCodeDesc();

    CoursesEntity findByTitle(String title);

    CoursesEntity findByCourseCode(String courseCode);

    CoursesEntity findByCourseCode(int courseCode);

    @Query("{'courseCode': {$regex: ?0, $options: 'i'}}")
    CoursesEntity findByCourseCodeIgnoreCase(String courseCode);

    CoursesEntity findByCourseCodeOrCourseCode(Integer courseCode, String courseCodeString);


}

package com.elearning.serviceimpl;

import com.elearning.dto.CoursesDto;
import com.elearning.dto.SectionDto;
import com.elearning.entity.CoursesEntity;
import com.elearning.entity.SectionEntity;
import com.elearning.exception.BaseException;
import com.elearning.exception.CoursesNotFoundException;
import com.elearning.repository.CoursesRepository;
import com.elearning.repository.SectionRepository;
import com.elearning.service.CoursesService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CoursesServiceImpl implements CoursesService {

    @Autowired
    private CoursesRepository coursesRepository;
    @Autowired
    private SectionRepository sectionRepository;


    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<CoursesDto> getCourses() {
        List<CoursesEntity> courses = coursesRepository.findAll();
        return courses.stream().map(coursesEntity -> modelMapper.map(coursesEntity, CoursesDto.class)).collect(Collectors.toList());
    }

    @Override
    public Optional<CoursesDto> getCourse(String id) throws CoursesNotFoundException {
        Optional<CoursesEntity> courseEntity = coursesRepository.findById(id);
        if (courseEntity.isEmpty()) {
            throw new CoursesNotFoundException("Course not found");
        } else {
            List<SectionEntity> sections = sectionRepository.findByCourseId(id);
            CoursesDto courseDto = modelMapper.map(courseEntity.get(), CoursesDto.class);
            List<SectionDto> sectionDtos = new ArrayList<>();

            for (SectionEntity sectionEntity : sections) {
                SectionDto sectionDto = modelMapper.map(sectionEntity, SectionDto.class);
                sectionDtos.add(sectionDto);
            }

            courseDto.setSections(sectionDtos);
            return Optional.of(courseDto);
        }
    }

    @Override
    public CoursesDto addCourse(CoursesDto courseDto) {
        try {
            String courseCode = courseDto.getCourseCode();

            // Check if course code contains only numbers
            if (courseCode.matches("\\d+")) {
                // Course code contains only numbers, check for duplicate using numeric representation
                CoursesEntity numericCourse = coursesRepository.findByCourseCode(Integer.parseInt(courseCode));
                if (numericCourse != null) {
                    throw new BaseException("Course code already exists");
                }
            } else {
                // Course code contains characters or a combination of characters and numbers,
                // check for duplicate using string representation
                CoursesEntity existingCourse = coursesRepository.findByCourseCode(courseCode);
                if (existingCourse != null) {
                    throw new BaseException("Course code already exists");
                }
            }

            CoursesEntity courseByTitle = coursesRepository.findByTitle(courseDto.getTitle());
            if (courseByTitle != null) {
                throw new BaseException("Course already exists");
            }

            CoursesEntity courseEntity = new CoursesEntity();
            courseEntity.setTitle(courseDto.getTitle());
            courseEntity.setDescription(courseDto.getDescription());
            courseEntity.setDepartments(courseDto.getDepartments());
            courseEntity.setCreditHours(courseDto.getCreditHours());
            courseEntity.setCourseCode(courseCode);

            CoursesEntity savedCoursesEntity = coursesRepository.save(courseEntity);

            return modelMapper.map(savedCoursesEntity, CoursesDto.class);
        } catch (Exception e) {
            throw new BaseException(e.getLocalizedMessage());
        }
    }


    @Override
    public Optional<CoursesDto> updateCourse(String id, CoursesDto courseDto) throws CoursesNotFoundException {
        Optional<CoursesEntity> existingCoursesEntity = coursesRepository.findById(id);
        if (existingCoursesEntity.isEmpty()) throw new CoursesNotFoundException("Course not found");

        String courseCode = courseDto.getCourseCode();

        // Check if course code contains only numbers
        if (courseCode.matches("\\d+")) {
            // Course code contains only numbers, check for duplicate using numeric representation
            CoursesEntity numericCourse = coursesRepository.findByCourseCode(Integer.parseInt(courseCode));
            if (numericCourse != null) {
                throw new BaseException("Course code already exists");
            }
        } else {
            // Course code contains characters or a combination of characters and numbers,
            // check for duplicate using string representation
            CoursesEntity existingCourse = coursesRepository.findByCourseCode(courseCode);
            if (existingCourse != null) {
                throw new BaseException("Course code already exists");
            }
        }

        CoursesEntity updatedCoursesEntity = existingCoursesEntity.get();
        updatedCoursesEntity.setTitle(courseDto.getTitle());
        updatedCoursesEntity.setDescription(courseDto.getDescription());
        updatedCoursesEntity.setDepartments(courseDto.getDepartments());
        updatedCoursesEntity.setCreditHours(courseDto.getCreditHours());
        updatedCoursesEntity.setCourseCode(courseDto.getCourseCode());

        coursesRepository.save(updatedCoursesEntity);

        return Optional.of(modelMapper.map(updatedCoursesEntity, CoursesDto.class));
    }

    @Override
    public void deleteCourse(String id) throws CoursesNotFoundException {
        Optional<CoursesEntity> existingCoursesEntity = coursesRepository.findById(id);
        if (existingCoursesEntity.isEmpty()) throw new CoursesNotFoundException("Course not found");

        coursesRepository.deleteById(id);
    }
}

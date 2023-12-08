package com.elearning.serviceimpl;


import com.elearning.dto.CategoryDto;
import com.elearning.entity.CategoryEntity;
import com.elearning.exception.CategoryNotFoundException;
import com.elearning.repository.CategoryRepository;
import com.elearning.service.CategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<CategoryDto> getCategories() {
        List<CategoryEntity> categories = categoryRepository.findAll();
        return categories.stream()
                .map(categoryEntity -> modelMapper.map(categoryEntity, CategoryDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<CategoryDto> getCategory(String id) {
        Optional<CategoryEntity> categoryEntity = categoryRepository.findById(id);
        return categoryEntity.map(entity -> modelMapper.map(entity, CategoryDto.class));
    }

    @Override
    public Optional<CategoryDto> updateCategory(String id, CategoryDto updatedCategoryDto) throws CategoryNotFoundException {
        Optional<CategoryEntity> existingCategoryEntity = categoryRepository.findById(id);
        if (existingCategoryEntity.isEmpty()) {
            throw new CategoryNotFoundException("Category not found");
        }

        CategoryEntity updatedCategoryEntity = modelMapper.map(updatedCategoryDto, CategoryEntity.class);
        updatedCategoryEntity.setCategoryId(id);
        categoryRepository.save(updatedCategoryEntity);

        return Optional.of(modelMapper.map(updatedCategoryEntity, CategoryDto.class));
    }

    @Override
    public void deleteCategory(String id) throws CategoryNotFoundException {
        Optional<CategoryEntity> existingCategoryEntity = categoryRepository.findById(id);
        if (existingCategoryEntity.isEmpty()) {
            throw new CategoryNotFoundException("Category not found");
        }

        categoryRepository.deleteById(id);
    }

    @Override
    public CategoryDto addCategory(CategoryDto categoryDto) {
        CategoryEntity categoryEntity = modelMapper.map(categoryDto, CategoryEntity.class);
        CategoryEntity savedCategoryEntity = categoryRepository.save(categoryEntity);
        return modelMapper.map(savedCategoryEntity, CategoryDto.class);
    }
}

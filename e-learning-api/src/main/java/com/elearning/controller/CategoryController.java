package com.elearning.controller;

import com.elearning.dto.CategoryDto;
import com.elearning.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getCategories() {
        List<CategoryDto> categories = categoryService.getCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategory(@PathVariable String id) {
        Optional<CategoryDto> category = categoryService.getCategory(id);
        return ResponseEntity.ok(category.orElse(null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable String id, @RequestBody CategoryDto updatedCategoryDto) {
        Optional<CategoryDto> updatedCategory = categoryService.updateCategory(id, updatedCategoryDto);
        return ResponseEntity.ok(updatedCategory.orElse(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<CategoryDto> addCategory(@RequestBody CategoryDto categoryDto) {
        CategoryDto newCategory = categoryService.addCategory(categoryDto);
        return ResponseEntity.ok(newCategory);
    }
}

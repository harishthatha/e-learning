package com.elearning.service;


import com.elearning.dto.CategoryDto;

import java.util.List;
import java.util.Optional;

public interface CategoryService {

    /**
     * Get all product categories.
     *
     * @return List of CategoryDto objects representing product categories.
     */
    List<CategoryDto> getCategories();

    /**
     * Get a specific product category by its ID.
     *
     * @param id ID of the category to retrieve.
     * @return Optional containing the CategoryDto object if found, empty otherwise.
     */
    Optional<CategoryDto> getCategory(String id);

    /**
     * Update an existing product category.
     *
     * @param id                 ID of the category to update.
     * @param updatedCategoryDto Updated CategoryDto object.
     * @return Optional containing the updated CategoryDto object if successful, empty otherwise.
     */
    Optional<CategoryDto> updateCategory(String id, CategoryDto updatedCategoryDto);

    /**
     * Delete a product category by its ID.
     *
     * @param id ID of the category to delete.
     */
    void deleteCategory(String id);

    /**
     * Add a new product category.
     *
     * @param categoryDto CategoryDto object representing the new category.
     * @return CategoryDto object representing the added category.
     */
    CategoryDto addCategory(CategoryDto categoryDto);
}

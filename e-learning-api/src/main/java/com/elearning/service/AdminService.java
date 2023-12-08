package com.elearning.service;

import com.elearning.dto.AdminDto;
import com.elearning.exception.AdminNotFoundException;

import java.util.List;
import java.util.Optional;

public interface AdminService {
    List<AdminDto> getAdmins();

    Optional<AdminDto> getAdmin(String id) throws AdminNotFoundException;

    AdminDto addAdmin(AdminDto adminDto);

    Optional<AdminDto> updateAdmin(String id, AdminDto updatedAdminDto) throws AdminNotFoundException;

    void deleteAdmin(String id) throws AdminNotFoundException;

    AdminDto findByEmail(String email) throws AdminNotFoundException;

    AdminDto login(AdminDto adminDto);
}

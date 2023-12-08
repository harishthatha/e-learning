package com.elearning.serviceimpl;

import com.elearning.dto.AdminDto;
import com.elearning.entity.AdminEntity;
import com.elearning.exception.AdminNotFoundException;
import com.elearning.repository.AdminRepository;
import com.elearning.service.AdminService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<AdminDto> getAdmins() {
        List<AdminEntity> admins = adminRepository.findAll();
        return admins.stream().map(adminEntity -> modelMapper.map(adminEntity, AdminDto.class)).collect(Collectors.toList());
    }

    @Override
    public Optional<AdminDto> getAdmin(String id) throws AdminNotFoundException {
        Optional<AdminEntity> adminEntity = adminRepository.findById(id);
        if (adminEntity.isEmpty()) {
            throw new AdminNotFoundException("Admin not found");
        } else {
            AdminDto adminDto = modelMapper.map(adminEntity.get(), AdminDto.class);
            adminDto.setRole("ROLE_ADMIN");
            return Optional.of(adminDto);
        }
    }

    @Override
    public AdminDto addAdmin(AdminDto adminDto) {
        AdminEntity adminEntity = modelMapper.map(adminDto, AdminEntity.class);
        AdminEntity savedAdminEntity = adminRepository.save(adminEntity);
        return modelMapper.map(savedAdminEntity, AdminDto.class);
    }

    @Override
    public Optional<AdminDto> updateAdmin(String id, AdminDto updatedAdminDto) throws AdminNotFoundException {
        Optional<AdminEntity> existingAdminEntity = adminRepository.findById(id);
        if (existingAdminEntity.isEmpty()) throw new AdminNotFoundException("Admin not found");

        AdminEntity updatedAdminEntity = modelMapper.map(updatedAdminDto, AdminEntity.class);
        updatedAdminEntity.setAdminId(id);
        adminRepository.save(updatedAdminEntity);

        return Optional.of(modelMapper.map(updatedAdminEntity, AdminDto.class));
    }

    @Override
    public void deleteAdmin(String id) throws AdminNotFoundException {
        Optional<AdminEntity> existingAdminEntity = adminRepository.findById(id);
        if (existingAdminEntity.isEmpty()) throw new AdminNotFoundException("Admin not found");

        adminRepository.deleteById(id);
    }

    @Override
    public AdminDto findByEmail(String email) throws AdminNotFoundException {
        AdminEntity adminEntity = adminRepository.findByEmail(email)
                .orElseThrow(() -> new AdminNotFoundException("Unknown user"));

        return modelMapper.map(adminEntity, AdminDto.class);
    }

    @Override
    public AdminDto login(AdminDto adminDto) {
        AdminEntity adminEntity = adminRepository.findByEmail(adminDto.getEmail())
                .orElseThrow(() -> new AdminNotFoundException("Admin not found"));
        if (adminEntity.getPassword().equals(adminDto.getPassword())) {
            AdminDto finalAdminDetails = modelMapper.map(adminEntity, AdminDto.class);
            finalAdminDetails.setPassword(null);
            finalAdminDetails.setRole("ROLE_ADMIN");
            return finalAdminDetails;
        }
        throw new AdminNotFoundException("Invalid password");
    }
}

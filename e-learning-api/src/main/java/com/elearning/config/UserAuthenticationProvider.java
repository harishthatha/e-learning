package com.elearning.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.elearning.dto.AdminDto;
import com.elearning.dto.InstructorDto;
import com.elearning.dto.StudentDto;
import com.elearning.exception.AdminNotFoundException;
import com.elearning.exception.InstructorNotFoundException;
import com.elearning.service.AdminService;
import com.elearning.service.InstructorService;
import com.elearning.service.StudentService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.*;

@RequiredArgsConstructor
@Component
public class UserAuthenticationProvider {

    private final InstructorService instructorService;
    private final AdminService adminService;
    private final StudentService studentService;
    @Value("${jwt.secret}")
    private String secretKey;

    @PostConstruct
    protected void init() {
        // this is to avoid having the raw secret key available in the JVM
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String createToken(String login, String userId, String role) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + 24 * 3600000); // 1 hour

        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.create()
                .withSubject(login)
                .withClaim("userId", userId)
                .withClaim("role", role)
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .sign(algorithm);
    }

    public Authentication validateToken(String token) throws
            InstructorNotFoundException, AdminNotFoundException {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        AdminDto adminDto = null;
        InstructorDto instructorDto = null;
        StudentDto studentDto = null;

        JWTVerifier verifier = JWT.require(algorithm)
                .build();

        DecodedJWT decoded = verifier.verify(token);
        String role = decoded.getClaim("role").asString();
        List<GrantedAuthority> authorities = new ArrayList<>();

        switch (role) {
            case "ROLE_ADMIN" -> {
                adminDto = adminService.findByEmail(decoded.getSubject());
                authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                adminDto.setAuthorities(authorities);
                adminDto.setUsername(decoded.getSubject());
            }
            case "ROLE_INSTRUCTOR" -> {
                instructorDto = instructorService.findByEmail(decoded.getSubject());
                authorities.add(new SimpleGrantedAuthority("ROLE_INSTRUCTOR"));
                instructorDto.setAuthorities(authorities);
                instructorDto.setUsername(decoded.getSubject());
            }
            case "ROLE_STUDENT" -> {
                studentDto = studentService.findByEmail(decoded.getSubject());
                authorities.add(new SimpleGrantedAuthority("ROLE_STUDENT"));
                studentDto.setAuthorities(authorities);
                studentDto.setUsername(decoded.getSubject());
            }
            default -> System.out.println("Unknown role: " + role);
        }

        return new UsernamePasswordAuthenticationToken(role.equals("ROLE_ADMIN")
                ? adminDto : role.equals("ROLE_INSTRUCTOR") ? instructorDto : studentDto, null, Collections.emptyList());
    }


}

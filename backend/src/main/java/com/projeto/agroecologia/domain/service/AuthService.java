package com.projeto.agroecologia.domain.service;

import com.projeto.agroecologia.domain.model.Auth;
import com.projeto.agroecologia.domain.repository.AuthRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    private final AuthRepository authRepository;

    public AuthService(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    public Auth saveUser(String fullName, String email, String password) {
        if (!authRepository.existsByEmail(email)) {
            Auth user = new Auth(fullName, email, password);
            return authRepository.save(user);
        }
        return null;
    }

    public boolean login(String email, String password) {
        return authRepository.findAll().stream()
                .anyMatch(u -> u.getEmail().equals(email) && u.getPassword().equals(password));
    }

    public List<Auth> findAllUsers() {
        return authRepository.findAll();
    }
}

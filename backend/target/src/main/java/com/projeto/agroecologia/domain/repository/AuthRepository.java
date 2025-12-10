package com.projeto.agroecologia.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projeto.agroecologia.domain.model.Auth;

public interface AuthRepository extends JpaRepository<Auth, Long> {
    boolean existsByEmail(String email);
}

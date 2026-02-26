package com.projeto.agroecologia.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projeto.agroecologia.domain.enume.RoleName;
import com.projeto.agroecologia.domain.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
    
}

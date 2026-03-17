package com.projeto.agroecologia.domain.repository;

import com.projeto.agroecologia.domain.model.Environment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnvironmentRepository extends JpaRepository<Environment, Long> {
}

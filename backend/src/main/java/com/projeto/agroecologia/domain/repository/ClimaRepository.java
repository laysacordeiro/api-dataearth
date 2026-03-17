package com.projeto.agroecologia.domain.repository;

import com.projeto.agroecologia.domain.model.Clima;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClimaRepository extends JpaRepository<Clima, Long> {
}

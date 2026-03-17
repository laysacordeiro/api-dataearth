package com.projeto.agroecologia.domain.repository;

import com.projeto.agroecologia.domain.model.Localidade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocalidadeRepository extends JpaRepository<Localidade, Long> {
}

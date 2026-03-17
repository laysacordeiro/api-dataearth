package com.projeto.agroecologia.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.projeto.agroecologia.domain.model.Especie;

public interface EspecieRepository extends JpaRepository<Especie, Long> { }

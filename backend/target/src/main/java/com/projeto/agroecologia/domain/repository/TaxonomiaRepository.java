package com.projeto.agroecologia.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.projeto.agroecologia.domain.model.Taxonomia;

public interface TaxonomiaRepository extends JpaRepository<Taxonomia, Long> {
    Taxonomia findByNomeAndNivel(String nome, String nivel);
    List<Taxonomia> findByNivel(String nivel);
}

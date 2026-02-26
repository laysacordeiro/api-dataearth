package com.projeto.agroecologia.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projeto.agroecologia.domain.model.Taxonomia;

public interface TaxonomiaRepository extends JpaRepository<Taxonomia, Long> {
    
    Optional<Taxonomia> findByNomeAndNivelAndParent(String nome, String nivel, Taxonomia parent);

    Optional<Taxonomia> findByNomeAndNivelAndParentIsNull(String nome, String nivel);

    List<Taxonomia> findByNivel(String nivel);
}
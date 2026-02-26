package com.projeto.agroecologia.domain.repository;

import com.projeto.agroecologia.domain.model.Monolito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface MonolitoRepository extends JpaRepository<Monolito, Long> {

    List<Monolito> findByCollectorContainingIgnoreCase(String collector);

    List<Monolito> findByLocalizacao_LocalidadeContainingIgnoreCase(String localidade);
}
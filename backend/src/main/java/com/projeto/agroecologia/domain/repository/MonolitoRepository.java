package com.projeto.agroecologia.domain.repository;

import com.projeto.agroecologia.domain.model.Monolito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;


public interface MonolitoRepository extends JpaRepository<Monolito, Long> {

    List<Monolito> findByCollectorContainingIgnoreCase(String collector);
    boolean existsByStationFieldNumber(String stationFieldNumber);
    Optional<Monolito> findByStationFieldNumber(String stationFieldNumber);
    List<Monolito> findByMetodoContainingIgnoreCase(String metodo);

    @Query("""
        SELECT DISTINCT m.metodo
        FROM Monolito m
        WHERE m.metodo IS NOT NULL
          AND TRIM(m.metodo) <> ''
        ORDER BY m.metodo
    """)
    List<String> listarMetodosDistinct();
    
}
package com.projeto.agroecologia.domain.repository;

import com.projeto.agroecologia.domain.model.Monolito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface MonolitoRepository extends JpaRepository<Monolito, Long> {

    List<Monolito> findByCollectorContainingIgnoreCase(String collector);
    boolean existsByStationFieldNumber(String stationFieldNumber);
    Optional<Monolito> findByStationFieldNumber(String stationFieldNumber);
    
}
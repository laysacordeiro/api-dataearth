package com.projeto.agroecologia.domain.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.projeto.agroecologia.domain.model.Especie;

public interface EspecieRepository extends JpaRepository<Especie, Long> { 
    List<Especie> findByAutorContainingIgnoreCase(String autor);
}

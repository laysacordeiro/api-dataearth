package com.projeto.agroecologia.domain.repository;

import com.projeto.agroecologia.domain.model.Tombo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TomboRepository extends JpaRepository<Tombo, Long> {

    // Busca todos os registros de espécies de um monólito específico
    List<Tombo> findByMonolitoId(Long monolitoId);
    boolean existsByIdentificador(String identificador);
    // Busca registros por um identificador específico (ex: código da amostra)
    List<Tombo> findByIdentificador(String identificador);
    List<Tombo> findByIdentificadorContainingIgnoreCase(String identificador);
}
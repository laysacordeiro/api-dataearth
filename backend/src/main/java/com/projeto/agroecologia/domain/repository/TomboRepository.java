package com.projeto.agroecologia.domain.repository;

import com.projeto.agroecologia.domain.model.Monolito;
import com.projeto.agroecologia.domain.model.Tombo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface TomboRepository extends JpaRepository<Tombo, Long> {

    // Busca todos os registros de espécies de um monólito específico
    List<Tombo> findByMonolitoId(Long monolitoId);

    boolean existsByIdentificador(String identificador);

    // Busca registros por um identificador específico (ex: código da amostra)
    List<Tombo> findByIdentificador(String identificador);

    List<Tombo> findByIdentificadorContainingIgnoreCase(String identificador);

    @Query("""
                SELECT DISTINCT t.monolito
                FROM Tombo t
                WHERE LOWER(t.especie.nome) LIKE LOWER(CONCAT('%', :nomeEspecie, '%'))
                   OR LOWER(t.especie.nomeCientifico) LIKE LOWER(CONCAT('%', :nomeEspecie, '%'))
                ORDER BY t.monolito.stationFieldNumber
            """)
    List<Monolito> buscarMonolitosPorEspecie(String nomeEspecie);
}
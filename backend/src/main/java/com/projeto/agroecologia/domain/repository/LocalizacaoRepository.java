package com.projeto.agroecologia.domain.repository;

import com.projeto.agroecologia.domain.model.Localizacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocalizacaoRepository extends JpaRepository<Localizacao, Long> {
    List<Localizacao> findByLocalidadeContainingIgnoreCase(String localidade);
}

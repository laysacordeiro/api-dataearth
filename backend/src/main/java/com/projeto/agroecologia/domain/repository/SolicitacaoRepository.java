package com.projeto.agroecologia.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projeto.agroecologia.domain.enume.SolicitacaoStatus;
import com.projeto.agroecologia.domain.model.Solicitacao;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    List<Solicitacao> findByStatus(SolicitacaoStatus status);
}

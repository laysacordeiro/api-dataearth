package com.projeto.agroecologia.domain.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.projeto.agroecologia.domain.model.Solicitacao;
import com.projeto.agroecologia.domain.service.SolicitacaoService;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/admin/solicitacoes")
@Tag(name = "Solicitações (Admin)", description = "Painel administrativo para aprovação/rejeição de solicitações de acesso")
public class SolicitacaoController {

    @Autowired
    private SolicitacaoService solicitacaoService;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<Solicitacao> listarTodas() {
        return solicitacaoService.listarTodas();
    }

    @PutMapping("/{id}/aceitar")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> aceitar(@PathVariable("id") Long id) {
        solicitacaoService.aceitar(id);
        return ResponseEntity.ok("Solicitação aceita com sucesso");
    }

    @PutMapping("/{id}/negar")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> negar(@PathVariable("id") Long id) {
        solicitacaoService.negar(id);
        return ResponseEntity.ok("Solicitação negada");
    }
}

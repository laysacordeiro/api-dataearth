package com.projeto.agroecologia.domain.controller;

import com.projeto.agroecologia.domain.model.Localizacao;
import com.projeto.agroecologia.domain.service.LocalizacaoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/localizacao")
public class LocalizacaoController {

    private final LocalizacaoService service;

    public LocalizacaoController(LocalizacaoService service) {
        this.service = service;
    }

    @PostMapping("/adicionar")
    public Localizacao criar(@RequestBody Localizacao localizacao) {
        return service.salvar(localizacao);
    }

    @GetMapping("/all")
    public List<Localizacao> listar() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public Localizacao buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @GetMapping("/buscar")
    public List<Localizacao> buscarPorNome(@RequestParam String nome) {
        return service.buscarPorNome(nome);
    }

    @DeleteMapping("/deletar/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}

package com.projeto.agroecologia.domain.controller;

import com.projeto.agroecologia.domain.model.Especie;
import com.projeto.agroecologia.domain.model.Monolito;
import com.projeto.agroecologia.domain.service.MonolitoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/monolito")
public class MonolitoController {

    private final MonolitoService service;

    @PostMapping("/especies/adicionar/{id}")
    public Monolito adicionarEspecies(
            @PathVariable Long id,
            @RequestBody List<Long> especiesIds) {

        return service.adicionarEspecies(id, especiesIds);
    }

    @GetMapping("/especies/{id}")
    public List<Especie> listarEspecies(@PathVariable Long id) {
        return service.listarEspecies(id);
    }

    public MonolitoController(MonolitoService service) {
        this.service = service;
    }

    @PostMapping("/adicionar")
    public Monolito criar(@RequestBody Monolito monolito) {
        return service.salvar(monolito);
    }

    @GetMapping("/all")
    public List<Monolito> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/buscar/collector")
    public List<Monolito> buscarPorCollector(@RequestParam String collector) {
        return service.buscarPorCollector(collector);
    }

    @GetMapping("/buscar/localizacao")
    public List<Monolito> buscarPorLocalizacao(@RequestParam String localidade) {
        return service.buscarPorLocalizacao(localidade);
    }

    @DeleteMapping("/deletar/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }

    @DeleteMapping("/especies/{monolitoId}/deletar")
    public ResponseEntity<Void> removerEspecieDoMonolito(
            @PathVariable Long monolitoId,
            @RequestParam Long especie) {

        service.removerEspecieDoMonolito(monolitoId, especie);
        return ResponseEntity.noContent().build();
    }
}

package com.projeto.agroecologia.domain.controller;

import com.projeto.agroecologia.domain.model.Especie;
import com.projeto.agroecologia.domain.model.Monolito;
import com.projeto.agroecologia.domain.model.Tombo;
import com.projeto.agroecologia.domain.service.MonolitoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/monolitos")
public class MonolitoController {

    private final MonolitoService service;

    @PostMapping("/{monolitoId}/especies/{especieId}")
    public ResponseEntity<Void> adicionarEspecieComDados(
            @PathVariable Long monolitoId,
            @PathVariable Long especieId,
            @RequestBody Tombo dados) { // Use @RequestBody para JSON
        
        service.adicionarEspecieComDados(monolitoId, especieId, dados.getAbundancia(), dados.getIdentificador());
        return ResponseEntity.status(201).build();
    }

    @GetMapping("/{id}/tombos")
    public List<Tombo> listarTombos(@PathVariable Long id) {
        return service.listarTombos(id); // Chamando o novo método do service
    }

    public MonolitoController(MonolitoService service) {
        this.service = service;
    }

    @PostMapping
    public Monolito criar(@RequestBody Monolito monolito) {
        return service.salvar(monolito);
    }

    @GetMapping
    public List<Monolito> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/collector")
    public List<Monolito> buscarPorCollector(@RequestParam String collector) {
        return service.buscarPorCollector(collector);
    }

    @GetMapping("/verificar")
    public ResponseEntity<Boolean> verificarExistencia(
            @RequestParam String stationFieldNumber) {

        boolean existe = service.existePorStationFieldNumber(stationFieldNumber);
        return ResponseEntity.ok(existe);
    }

    @GetMapping("/tombos/buscar")
    public ResponseEntity<List<Tombo>> buscarPorIdentificador(@RequestParam String identificador) {
        List<Tombo> tombos = service.buscarTombosPorIdentificador(identificador);
        return ResponseEntity.ok(tombos);
    }

    @GetMapping("/tombos/verificar-identificador")
    public ResponseEntity<Boolean> verificarIdentificador(@RequestParam String identificador) {
        return ResponseEntity.ok(service.existeIdentificador(identificador));
    }

    @DeleteMapping("/deletar/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }

    @DeleteMapping("/tombos/{tomboId}")
    public ResponseEntity<Void> removerTombo(@PathVariable Long tomboId) {
        service.removerTombo(tomboId);
        return ResponseEntity.noContent().build();
    }
}
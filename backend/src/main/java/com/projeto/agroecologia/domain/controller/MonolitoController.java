package com.projeto.agroecologia.domain.controller;

import com.projeto.agroecologia.domain.model.Monolito;
import com.projeto.agroecologia.domain.model.Tombo;
import com.projeto.agroecologia.domain.service.MonolitoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/monolitos")
@Tag(name = "Monolitos", description = "Gestão de monolitos, tombos e associação com espécies")
public class MonolitoController {

    private final MonolitoService service;

    public MonolitoController(MonolitoService service) {
        this.service = service;
    }

    @PostMapping("/{monolitoId}/especies/{especieId}")
    public ResponseEntity<Void> adicionarEspecieComDados(
            @PathVariable("monolitoId") Long monolitoId,
            @PathVariable("especieId") Long especieId,
            @RequestBody Tombo dados) {

        service.adicionarEspecieComDados(
                monolitoId,
                especieId,
                dados.getAbundancia(),
                dados.getIdentificador());
        return ResponseEntity.status(201).build();
    }

    @GetMapping("/{id}/tombos")
    public List<Tombo> listarTombos(@PathVariable("id") Long id) {
        return service.listarTombos(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Monolito> buscarPorId(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public Monolito atualizar(@PathVariable("id") Long id, @RequestBody Monolito monolito) {
        return service.atualizar(id, monolito);
    }

    @PatchMapping("/{id}/parcela/{parcelaId}")
    public ResponseEntity<Monolito> vincularParcela(
            @PathVariable("id") Long monolitoId,
            @PathVariable("parcelaId") Long parcelaId) {
        return ResponseEntity.ok(service.vincularParcela(monolitoId, parcelaId));
    }

    @DeleteMapping("/{id}/parcela")
    public ResponseEntity<Monolito> desvincularParcela(@PathVariable("id") Long monolitoId) {
        return ResponseEntity.ok(service.desvincularParcela(monolitoId));
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
    public List<Monolito> buscarPorCollector(@RequestParam("collector") String collector) {
        return service.buscarPorCollector(collector);
    }

    @GetMapping("/metodo")
    public List<Monolito> buscarPorMetodo(@RequestParam("metodo") String metodo) {
        return service.buscarPorMetodo(metodo);
    }

    @GetMapping("/metodos")
    public List<String> listarMetodos() {
        return service.listarMetodos();
    }

    @GetMapping("/especie")
    public List<Monolito> buscarPorEspecie(@RequestParam("especie") String especie) {
        return service.buscarMonolitosPorEspecie(especie);
    }

    @GetMapping("/verificar")
    public ResponseEntity<Boolean> verificarExistencia(
            @RequestParam("stationFieldNumber") String stationFieldNumber) {

        boolean existe = service.existePorStationFieldNumber(stationFieldNumber);
        return ResponseEntity.ok(existe);
    }

    @GetMapping("/tombos/buscar")
    public ResponseEntity<List<Tombo>> buscarPorIdentificador(@RequestParam("identificador") String identificador) {
        List<Tombo> tombos = service.buscarTombosPorIdentificador(identificador);
        return ResponseEntity.ok(tombos);
    }

    @GetMapping("/tombos/verificar-identificador")
    public ResponseEntity<Boolean> verificarIdentificador(@RequestParam("identificador") String identificador) {
        return ResponseEntity.ok(service.existeIdentificador(identificador));
    }

    @DeleteMapping("/deletar/{id}")
    public void deletar(@PathVariable("id") Long id) {
        service.deletar(id);
    }

    @DeleteMapping("/tombos/{tomboId}")
    public ResponseEntity<Void> removerTombo(@PathVariable("tomboId") Long tomboId) {
        service.removerTombo(tomboId);
        return ResponseEntity.noContent().build();
    }
}
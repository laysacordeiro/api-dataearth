package com.projeto.agroecologia.domain.controller;

import com.projeto.agroecologia.domain.model.Clima;
import com.projeto.agroecologia.domain.service.ClimaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/climas")
public class ClimaController {

    private final ClimaService service;

    public ClimaController(ClimaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Clima> criar(@RequestBody Clima clima) {
        return ResponseEntity.status(201).body(service.salvar(clima));
    }

    @GetMapping
    public ResponseEntity<List<Clima>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Clima> buscarPorId(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Clima> atualizar(@PathVariable("id") Long id, @RequestBody Clima clima) {
        Clima existente = service.buscarPorId(id);

        existente.setAvg_temp(clima.getAvg_temp());
        existente.setClima_koppen(clima.getClima_koppen());
        existente.setAvg_precip(clima.getAvg_precip());
        existente.setDescription(clima.getDescription());

        return ResponseEntity.ok(service.salvar(existente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable("id") Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

package com.projeto.agroecologia.domain.controller;

import com.projeto.agroecologia.domain.model.Environment;
import com.projeto.agroecologia.domain.service.EnvironmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/environments")
public class EnvironmentController {

    private final EnvironmentService service;

    public EnvironmentController(EnvironmentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Environment> criar(@RequestBody Environment environment) {
        return ResponseEntity.status(201).body(service.salvar(environment));
    }

    @GetMapping
    public ResponseEntity<List<Environment>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Environment> buscarPorId(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Environment> atualizar(@PathVariable("id") Long id, @RequestBody Environment environment) {
        Environment existente = service.buscarPorId(id);

        existente.setSoilType(environment.getSoilType());
        existente.setCurrentVege(environment.getCurrentVege());
        existente.setOriginalVege(environment.getOriginalVege());
        existente.setVegeAge(environment.getVegeAge());
        existente.setVegeType(environment.getVegeType());
        existente.setPrepType(environment.getPrepType());
        existente.setBiome(environment.getBiome());

        return ResponseEntity.ok(service.salvar(existente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable("id") Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

package com.projeto.agroecologia.domain.controller;

import com.projeto.agroecologia.domain.model.Localidade;
import com.projeto.agroecologia.domain.service.LocalidadeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/localidades")
public class LocalidadeController {

    private final LocalidadeService service;

    public LocalidadeController(LocalidadeService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Localidade> criar(@RequestBody Localidade localidade) {
        return ResponseEntity.status(201).body(service.salvar(localidade));
    }

    @GetMapping
    public ResponseEntity<List<Localidade>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Localidade> buscarPorId(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Localidade> atualizar(@PathVariable("id") Long id, @RequestBody Localidade localidade) {
        Localidade existente = service.buscarPorId(id);

        existente.setLocality(localidade.getLocality());
        existente.setCounty(localidade.getCounty());
        existente.setState(localidade.getState());
        existente.setCountry(localidade.getCountry());
        existente.setContinent(localidade.getContinent());
        existente.setLatitude(localidade.getLatitude());
        existente.setLongitude(localidade.getLongitude());
        existente.setName_uc(localidade.getName_uc());
        existente.setClass_uc(localidade.getClass_uc());

        return ResponseEntity.ok(service.salvar(existente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable("id") Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

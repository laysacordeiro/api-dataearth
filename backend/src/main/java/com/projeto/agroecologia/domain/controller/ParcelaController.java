package com.projeto.agroecologia.domain.controller;

import com.projeto.agroecologia.domain.model.Parcela;
import com.projeto.agroecologia.domain.service.ParcelaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/parcelas")
public class ParcelaController {

    private final ParcelaService service;

    public ParcelaController(ParcelaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Parcela> criar(@RequestBody Parcela parcela, @RequestParam(required = false) Long monolitoId) {
        return ResponseEntity.status(201).body(service.salvarComMonolito(parcela, monolitoId));
    }

    @GetMapping
    public ResponseEntity<List<Parcela>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Parcela> buscarPorId(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Parcela> atualizar(@PathVariable("id") Long id, @RequestBody Parcela parcela) {
        Parcela existente = service.buscarPorId(id);
        
        existente.setProprietario(parcela.getProprietario());
        existente.setUsoDaTerra(parcela.getUsoDaTerra());
        existente.setDataDoEvento(parcela.getDataDoEvento());
        
        if (parcela.getLocalidade() != null) {
            existente.setLocalidade(parcela.getLocalidade());
        }
        if (parcela.getClima() != null) {
            existente.setClima(parcela.getClima());
        }
        if (parcela.getEnvironment() != null) {
            existente.setEnvironment(parcela.getEnvironment());
        }
        
        return ResponseEntity.ok(service.salvar(existente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable("id") Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

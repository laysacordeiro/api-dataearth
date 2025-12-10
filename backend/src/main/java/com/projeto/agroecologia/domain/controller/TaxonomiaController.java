package com.projeto.agroecologia.domain.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;

import com.projeto.agroecologia.domain.model.Taxonomia;
import com.projeto.agroecologia.domain.service.TaxonomiaService;

@RestController
@RequestMapping("/taxonomias")
public class TaxonomiaController {

    private final TaxonomiaService service;

    public TaxonomiaController(TaxonomiaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Taxonomia> listar() {
        return service.listar();
    }

    @GetMapping("/nivel/{nivel}")
    public List<Taxonomia> filtrarPorNivel(@PathVariable String nivel) {
        return service.filtrarPorNivel(nivel);
    }


    @PostMapping("/adicionar")
    public Taxonomia salvar(@RequestBody Taxonomia taxonomia) {
        return service.salvar(taxonomia);
    }

    @PutMapping("/editar/{id}")
    public Taxonomia atualizar(@PathVariable Long id, @RequestBody Taxonomia taxonomia) {
        return service.atualizar(id, taxonomia);
    }


    @DeleteMapping("/deletar/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}

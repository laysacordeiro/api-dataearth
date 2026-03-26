package com.projeto.agroecologia.domain.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;

import com.projeto.agroecologia.domain.model.Taxonomia;
import com.projeto.agroecologia.domain.service.TaxonomiaService;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/taxonomias")
@Tag(name = "Taxonomias", description = "Gestão da hierarquia taxonômica (reino, filo, classe, ordem, família, gênero)")
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
    public List<Taxonomia> filtrarPorNivel(@PathVariable("nivel") String nivel) {
        return service.filtrarPorNivel(nivel);
    }

    @PostMapping("/adicionar")
    public Taxonomia salvar(@RequestBody Taxonomia taxonomia) {
        return service.salvar(taxonomia);
    }

    @PutMapping("/editar/{id}")
    public Taxonomia atualizar(@PathVariable("id") Long id, @RequestBody Taxonomia taxonomia) {
        return service.atualizar(id, taxonomia);
    }

    @DeleteMapping("/deletar/{id}")
    public void excluir(@PathVariable("id") Long id) {
        service.excluir(id);
    }
}


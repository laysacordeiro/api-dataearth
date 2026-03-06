package com.projeto.agroecologia.domain.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;

import com.projeto.agroecologia.domain.model.Especie;
import com.projeto.agroecologia.domain.service.EspecieService;

@RestController
@RequestMapping("/especies")
public class EspecieController {

    private final EspecieService service;

    public EspecieController(EspecieService service) {
        this.service = service;
    }

    @GetMapping
    public List<Especie> listar() {
        return service.listar();
    }

    @GetMapping("/autor/{autor}")
    public List<Especie> filtrarPorAutor(@PathVariable String autor) {
        return service.filtrarPorAutor(autor);
    }

    @GetMapping("/taxonomia")
    public List<Especie> filtrarPorTaxonomia(
            @RequestParam String nivel,
            @RequestParam String nome) {
        return service.filtrarPorTaxonomia(nivel, nome);
    }

    @GetMapping("/{id}")
    public Especie buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @PostMapping("/adicionar")
    public Especie salvar(@RequestBody Especie especie) {
        return service.salvar(especie);
    }

    @PutMapping("/editar/{id}")
    public Especie atualizar(@PathVariable Long id, @RequestBody Especie especie) {
        return service.atualizar(id, especie);
    }

    @DeleteMapping("/deletar/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
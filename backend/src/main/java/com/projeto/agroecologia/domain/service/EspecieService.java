package com.projeto.agroecologia.domain.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.projeto.agroecologia.domain.model.Especie;
import com.projeto.agroecologia.domain.model.Taxonomia;
import com.projeto.agroecologia.domain.repository.EspecieRepository;

@Service
public class EspecieService {

    private final EspecieRepository repository;
    private final TaxonomiaService taxonomiaService;

    public EspecieService(EspecieRepository repository, TaxonomiaService taxonomiaService) {
        this.repository = repository;
        this.taxonomiaService = taxonomiaService;
    }

    public List<Especie> listar() {
        return repository.findAll();
    }

    public List<Especie> filtrarPorAutor(String autor) {
        return repository.findByAutorContainingIgnoreCase(autor);
    }

    public List<Especie> filtrarPorTaxonomia(String nivel, String nome) {
        List<Especie> especies = repository.findAll();

        return especies.stream()
            .filter(especie -> pertenceATaxonomia(especie, nivel, nome))
            .collect(Collectors.toList());
    }

    private boolean pertenceATaxonomia(Especie especie, String nivel, String nome) {
        if (especie.getTaxonomia() == null) {
            return false;
        }

        Taxonomia atual = taxonomiaService.carregarCompleta(especie.getTaxonomia());

        while (atual != null) {
            boolean nivelOk = atual.getNivel() != null && atual.getNivel().equalsIgnoreCase(nivel);
            boolean nomeOk = atual.getNome() != null && atual.getNome().equalsIgnoreCase(nome);

            if (nivelOk && nomeOk) {
                return true;
            }

            atual = atual.getParent();
        }

        return false;
    }

    @Transactional
    public Especie salvar(Especie especie) {
        if (especie.getTaxonomia() != null) {
            Taxonomia taxonomiaProcessada = taxonomiaService.salvar(especie.getTaxonomia());
            especie.setTaxonomia(taxonomiaProcessada);
        }
        return repository.save(especie);
    }

    public Especie buscar(Long id) {
        Especie especie = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Espécie não encontrada"));

        if (especie.getTaxonomia() != null) {
            especie.setTaxonomia(taxonomiaService.carregarCompleta(especie.getTaxonomia()));
        }
        return especie;
    }

    @Transactional
    public Especie atualizar(Long id, Especie nova) {
        Especie existente = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Espécie não encontrada"));

        existente.setNome(nova.getNome());
        existente.setNomeCientifico(nova.getNomeCientifico());
        existente.setAutor(nova.getAutor());
        existente.setAno(nova.getAno());
        existente.setDescricao(nova.getDescricao());

        if (nova.getTaxonomia() != null && nova.getTaxonomia().getId() != null) {
            Taxonomia taxDB = taxonomiaService.buscar(nova.getTaxonomia().getId());
            existente.setTaxonomia(taxDB);
        }

        return repository.saveAndFlush(existente);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}
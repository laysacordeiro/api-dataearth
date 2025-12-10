package com.projeto.agroecologia.domain.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.projeto.agroecologia.domain.model.Especie;
import com.projeto.agroecologia.domain.model.Taxonomia;
import com.projeto.agroecologia.domain.repository.EspecieRepository;
import com.projeto.agroecologia.domain.service.TaxonomiaService;

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

    public Especie salvar(Especie especie) {

        if (especie.getTaxonomia() != null && especie.getTaxonomia().getId() != null) {

            Taxonomia taxonomia = taxonomiaService.buscar(
                especie.getTaxonomia().getId()
            );

            especie.setTaxonomia(taxonomia);
        } else {
            throw new RuntimeException("Taxonomia (com ID) é obrigatória para cadastrar espécie.");
        }

        return repository.save(especie);
    }


    public Especie buscar(Long id) {
        Especie especie = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Espécie não encontrada"));

        // força carregar a cadeia completa
        if (especie.getTaxonomia() != null) {
            Taxonomia completa = taxonomiaService.carregarCompleta(especie.getTaxonomia());
            especie.setTaxonomia(completa);
        }

        return especie;
    }


    public Especie atualizar(Long id, Especie nova) {
        Especie existente = buscar(id);

        existente.setNome(nova.getNome());
        existente.setNomeCientifico(nova.getNomeCientifico());
        existente.setAno(nova.getAno());
        existente.setDescricao(nova.getDescricao());

        if (nova.getTaxonomia() != null) {
            Taxonomia taxonomiaAtualizada = taxonomiaService.salvar(nova.getTaxonomia());
            existente.setTaxonomia(taxonomiaAtualizada);
        }

        return repository.save(existente);
    }


    public void excluir(Long id) {
        repository.deleteById(id);
    }
}

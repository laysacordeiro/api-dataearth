package com.projeto.agroecologia.domain.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.projeto.agroecologia.domain.model.Taxonomia;
import com.projeto.agroecologia.domain.repository.TaxonomiaRepository;

@Service
public class TaxonomiaService {

    private final TaxonomiaRepository repository;

    public TaxonomiaService(TaxonomiaRepository repository) {
        this.repository = repository;
    }

    public List<Taxonomia> listar() {
        return repository.findAll();
    }

    @Transactional
    public Taxonomia salvar(Taxonomia taxonomia) {
        return salvarRecursivo(taxonomia);
    }

    private Taxonomia salvarRecursivo(Taxonomia atual) {
        if (atual == null) return null;

        if (atual.getNome() == null || atual.getNome().trim().isEmpty()) {
            return (atual.getParent() != null) ? salvarRecursivo(atual.getParent()) : null;
        }

        Taxonomia paiPersistido = null;
        if (atual.getParent() != null) {
            paiPersistido = salvarRecursivo(atual.getParent());
        }

        Optional<Taxonomia> existente;
        if (paiPersistido == null) {
            existente = repository.findByNomeAndNivelAndParentIsNull(atual.getNome(), atual.getNivel());
        } else {
            existente = repository.findByNomeAndNivelAndParent(atual.getNome(), atual.getNivel(), paiPersistido);
        }

        if (existente.isPresent()) {
            return existente.get();
        }

        Taxonomia novo = new Taxonomia();
        novo.setNome(atual.getNome());
        novo.setNivel(atual.getNivel());
        novo.setParent(paiPersistido);

        return repository.save(novo);
    }
    @Transactional
public Taxonomia atualizar(Long id, Taxonomia nova) {
    Taxonomia existente = repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Taxonomia não encontrada"));
    
    existente.setNome(nova.getNome());
    existente.setNivel(nova.getNivel());
    if (nova.getParent() != null && nova.getParent().getId() != null) {
        Taxonomia paiExistente = repository.findById(nova.getParent().getId())
            .orElseThrow(() -> new RuntimeException("Pai não encontrado"));
        existente.setParent(paiExistente);
    } 
    return repository.saveAndFlush(existente);
}

    public Taxonomia carregarCompleta(Taxonomia tax) {
    if (tax == null) return null;
    
    if (tax.getParent() != null) {
        Taxonomia parent = repository.findById(tax.getParent().getId()).orElse(null);
        if (parent != null) {
            tax.setParent(carregarCompleta(parent));
        }
    }
    return tax;
}

    public Taxonomia buscar(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Taxonomia não encontrada"));
    }

    public List<Taxonomia> filtrarPorNivel(String nivel) {
        return repository.findByNivel(nivel);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}
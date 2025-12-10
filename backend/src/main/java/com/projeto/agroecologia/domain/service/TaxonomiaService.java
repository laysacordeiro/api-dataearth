package com.projeto.agroecologia.domain.service;

import java.util.List;
import org.springframework.stereotype.Service;
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

    public Taxonomia salvar(Taxonomia taxonomia) {
        return salvarRecursivo(taxonomia);
    }

    public List<Taxonomia> filtrarPorNivel(String nivel) {
        return repository.findByNivel(nivel);
    }


    private Taxonomia salvarRecursivo(Taxonomia atual) {

        // Primeiro salva o parent recursivamente
        if (atual.getParent() != null) {
            Taxonomia parentSalvo = salvarRecursivo(atual.getParent());
            atual.setParent(parentSalvo);
        }

        // Se já existe, retorna ele
        if (atual.getId() != null) {
            return repository.findById(atual.getId())
                    .orElseThrow(() -> new RuntimeException("Taxonomia não encontrada"));
        }

        // Verifica se já existe registro com mesmo nome e nível
        Taxonomia existente = repository.findByNomeAndNivel(atual.getNome(), atual.getNivel());
        if (existente != null) {
            return existente;
        }

        // Salva o atual
        return repository.save(atual);
    }

    public Taxonomia buscar(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Taxonomia não encontrada"));
    }

    public Taxonomia atualizar(Long id, Taxonomia nova) {
        Taxonomia existente = buscar(id);

        existente.setNome(nova.getNome());
        existente.setNivel(nova.getNivel());

        if (nova.getParent() != null && nova.getParent().getId() != null) {
            Taxonomia parentExistente = repository.findById(nova.getParent().getId())
                    .orElseThrow(() -> new RuntimeException("Parent não encontrado"));
            existente.setParent(parentExistente);
        } else {
            existente.setParent(null);
        }

        return repository.save(existente);
    }


    public Taxonomia carregarCompleta(Taxonomia tax) {
        if (tax == null) return null;

        // força carregar o parent
        if (tax.getParent() != null && tax.getParent().getId() != null) {
            Taxonomia parent = repository.findById(tax.getParent().getId())
                .orElse(null);

            tax.setParent(carregarCompleta(parent));
        }

        return tax;
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}

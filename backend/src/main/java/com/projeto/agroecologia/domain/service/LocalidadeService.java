package com.projeto.agroecologia.domain.service;

import com.projeto.agroecologia.domain.model.Localidade;
import com.projeto.agroecologia.domain.repository.LocalidadeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocalidadeService {

    private final LocalidadeRepository localidadeRepository;

    public LocalidadeService(LocalidadeRepository localidadeRepository) {
        this.localidadeRepository = localidadeRepository;
    }

    public List<Localidade> listarTodos() {
        return localidadeRepository.findAll();
    }

    public Localidade salvar(Localidade localidade) {
        return localidadeRepository.save(localidade);
    }

    public Localidade buscarPorId(Long id) {
        return localidadeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Localidade não encontrada"));
    }

    public void deletar(Long id) {
        if (!localidadeRepository.existsById(id)) {
            throw new RuntimeException("Localidade não encontrada");
        }
        localidadeRepository.deleteById(id);
    }
}

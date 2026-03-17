package com.projeto.agroecologia.domain.service;

import com.projeto.agroecologia.domain.model.Parcela;
import com.projeto.agroecologia.domain.repository.ParcelaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParcelaService {

    private final ParcelaRepository parcelaRepository;

    public ParcelaService(ParcelaRepository parcelaRepository) {
        this.parcelaRepository = parcelaRepository;
    }

    public List<Parcela> listarTodos() {
        return parcelaRepository.findAll();
    }

    public Parcela salvar(Parcela parcela) {
        return parcelaRepository.save(parcela);
    }

    public Parcela buscarPorId(Long id) {
        return parcelaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parcela não encontrada"));
    }

    public void deletar(Long id) {
        if (!parcelaRepository.existsById(id)) {
            throw new RuntimeException("Parcela não encontrada");
        }
        parcelaRepository.deleteById(id);
    }
}

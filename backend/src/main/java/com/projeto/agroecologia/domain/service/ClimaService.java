package com.projeto.agroecologia.domain.service;

import com.projeto.agroecologia.domain.model.Clima;
import com.projeto.agroecologia.domain.repository.ClimaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClimaService {

    private final ClimaRepository climaRepository;

    public ClimaService(ClimaRepository climaRepository) {
        this.climaRepository = climaRepository;
    }

    public List<Clima> listarTodos() {
        return climaRepository.findAll();
    }

    public Clima salvar(Clima clima) {
        return climaRepository.save(clima);
    }

    public Clima buscarPorId(Long id) {
        return climaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Clima não encontrado"));
    }

    public void deletar(Long id) {
        if (!climaRepository.existsById(id)) {
            throw new RuntimeException("Clima não encontrado");
        }
        climaRepository.deleteById(id);
    }
}

package com.projeto.agroecologia.domain.service;

import com.projeto.agroecologia.domain.model.Environment;
import com.projeto.agroecologia.domain.repository.EnvironmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnvironmentService {

    private final EnvironmentRepository environmentRepository;

    public EnvironmentService(EnvironmentRepository environmentRepository) {
        this.environmentRepository = environmentRepository;
    }

    public List<Environment> listarTodos() {
        return environmentRepository.findAll();
    }

    public Environment salvar(Environment environment) {
        return environmentRepository.save(environment);
    }

    public Environment buscarPorId(Long id) {
        return environmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Environment não encontrado"));
    }

    public void deletar(Long id) {
        if (!environmentRepository.existsById(id)) {
            throw new RuntimeException("Environment não encontrado");
        }
        environmentRepository.deleteById(id);
    }
}

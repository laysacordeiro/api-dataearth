package com.projeto.agroecologia.domain.service;

import com.projeto.agroecologia.domain.model.Localizacao;
import com.projeto.agroecologia.domain.repository.LocalizacaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocalizacaoService {

    private final LocalizacaoRepository repository;

    public LocalizacaoService(LocalizacaoRepository repository) {
        this.repository = repository;
    }

    public Localizacao salvar(Localizacao localizacao) {
        return repository.save(localizacao);
    }

    public List<Localizacao> listarTodas() {
        return repository.findAll();
    }

    public Localizacao buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Localização não encontrada"));
    }

    public List<Localizacao> buscarPorNome(String nome) {
        return repository.findByLocalidadeContainingIgnoreCase(nome);
    }

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Localização não encontrada");
        }
        repository.deleteById(id);
    }
}

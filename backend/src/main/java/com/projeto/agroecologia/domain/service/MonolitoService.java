package com.projeto.agroecologia.domain.service;

import com.projeto.agroecologia.domain.model.Especie;
import com.projeto.agroecologia.domain.model.Localizacao;
import com.projeto.agroecologia.domain.model.Monolito;
import com.projeto.agroecologia.domain.repository.EspecieRepository;
import com.projeto.agroecologia.domain.repository.LocalizacaoRepository;
import com.projeto.agroecologia.domain.repository.MonolitoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MonolitoService {

    @Autowired
    private final MonolitoRepository monolitoRepository;

    private final LocalizacaoRepository localizacaoRepository;

    @Autowired
    private EspecieRepository especieRepository;

    @Transactional
    public Monolito adicionarEspecies(Long monolitoId, List<Long> especiesIds) {
        Monolito monolito = monolitoRepository.findById(monolitoId)
                .orElseThrow(() -> new RuntimeException("Monólito não encontrado"));

        List<Especie> especies = especieRepository.findAllById(especiesIds);

        monolito.getEspecies().addAll(especies);

        return monolitoRepository.save(monolito);
    }

    public List<Especie> listarEspecies(Long monolitoId) {
        Monolito monolito = monolitoRepository.findById(monolitoId)
                .orElseThrow(() -> new RuntimeException("Monólito não encontrado"));

        return monolito.getEspecies();
    }

    public MonolitoService(MonolitoRepository monolitoRepository,
                           LocalizacaoRepository localizacaoRepository) {
        this.monolitoRepository = monolitoRepository;
        this.localizacaoRepository = localizacaoRepository;
    }

    public Monolito salvar(Monolito monolito) {

        Localizacao localizacao = monolito.getLocalizacao();

        if (localizacao == null) {
            throw new RuntimeException("Monólito deve possuir uma localização");
        }

        if (localizacao.getId() != null) {
            localizacao = localizacaoRepository.findById(localizacao.getId())
                    .orElseThrow(() -> new RuntimeException("Localização não encontrada"));
        } else {
            localizacao = localizacaoRepository.save(localizacao);
        }

        monolito.setLocalizacao(localizacao);
        return monolitoRepository.save(monolito);
    }

    public List<Monolito> listarTodos() {
        return monolitoRepository.findAll();
    }

    public List<Monolito> buscarPorCollector(String collector) {
        return monolitoRepository.findByCollectorContainingIgnoreCase(collector);
    }

    public List<Monolito> buscarPorLocalizacao(String localidade) {
        return monolitoRepository
                .findByLocalizacao_LocalidadeContainingIgnoreCase(localidade);
    }

    public void deletar(Long id) {
        if (!monolitoRepository.existsById(id)) {
            throw new RuntimeException("Monólito não encontrado");
        }
        monolitoRepository.deleteById(id);
    }

    @Transactional
    public void removerEspecieDoMonolito(Long monolitoId, Long especieId) {

        Monolito monolito = monolitoRepository.findById(monolitoId)
                .orElseThrow(() -> new RuntimeException("Monólito não encontrado"));

        Especie especie = especieRepository.findById(especieId)
                .orElseThrow(() -> new RuntimeException("Espécie não encontrada"));

        monolito.getEspecies().remove(especie);
    }
}

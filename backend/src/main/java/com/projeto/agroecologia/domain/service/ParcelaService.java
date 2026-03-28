package com.projeto.agroecologia.domain.service;

import com.projeto.agroecologia.domain.model.Monolito;
import com.projeto.agroecologia.domain.model.Parcela;
import com.projeto.agroecologia.domain.repository.MonolitoRepository;
import com.projeto.agroecologia.domain.repository.ParcelaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ParcelaService {

    private final ParcelaRepository parcelaRepository;
    private final MonolitoRepository monolitoRepository;

    public ParcelaService(ParcelaRepository parcelaRepository, MonolitoRepository monolitoRepository) {
        this.parcelaRepository = parcelaRepository;
        this.monolitoRepository = monolitoRepository;
    }

    public List<Parcela> listarTodos() {
        return parcelaRepository.findAll();
    }

    @Transactional
    public Parcela salvar(Parcela parcela) {
        return parcelaRepository.save(parcela);
    }

    @Transactional
    public Parcela salvarComMonolito(Parcela parcela, List<Long> monolitoIds) {
        Parcela salva = parcelaRepository.save(parcela);
        if (monolitoIds != null && !monolitoIds.isEmpty()) {
            for (Long monolitoId : monolitoIds) {
                monolitoRepository.findById(monolitoId).ifPresent(m -> {
                    m.setParcela(salva);
                    monolitoRepository.save(m);
                });
            }
        }
        return salva;
    }

    public List<Monolito> listarMonolitos(Long parcelaId) {
        Parcela parcela = buscarPorId(parcelaId);
        return parcela.getMonolitos();
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

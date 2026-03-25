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
    public Parcela salvarComMonolito(Parcela parcela, Long monolitoId) {
        Parcela salva = parcelaRepository.save(parcela);
        if (monolitoId != null) {
            Monolito monolito = monolitoRepository.findById(monolitoId)
                    .orElseThrow(() -> new RuntimeException("Monólito não encontrado"));
            monolito.setParcela(salva);
            monolitoRepository.save(monolito);
        }
        return salva;
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

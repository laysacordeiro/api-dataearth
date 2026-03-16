package com.projeto.agroecologia.domain.service;

import com.projeto.agroecologia.domain.model.Especie;
import com.projeto.agroecologia.domain.model.Monolito;
import com.projeto.agroecologia.domain.model.Tombo;
import com.projeto.agroecologia.domain.repository.EspecieRepository;
import com.projeto.agroecologia.domain.repository.MonolitoRepository;
import com.projeto.agroecologia.domain.repository.TomboRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MonolitoService {

    private final MonolitoRepository monolitoRepository;
    private final EspecieRepository especieRepository;
    private final TomboRepository tomboRepository;

    public MonolitoService(
            MonolitoRepository monolitoRepository,
            EspecieRepository especieRepository,
            TomboRepository tomboRepository
    ) {
        this.monolitoRepository = monolitoRepository;
        this.especieRepository = especieRepository;
        this.tomboRepository = tomboRepository;
    }

    /* ============================
       MONÓLITO
    ============================ */

    public List<Monolito> listarTodos() {
        return monolitoRepository.findAll();
    }

    public Monolito salvar(Monolito monolito) {

        if (monolitoRepository.existsByStationFieldNumber(
                monolito.getStationFieldNumber())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Station Field Number já cadastrado"
            );
        }

        return monolitoRepository.save(monolito);
    }

    public Monolito buscarPorId(Long id) {
        return monolitoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Monólito não encontrado"));
    }

    public void deletar(Long id) {
        if (!monolitoRepository.existsById(id)) {
            throw new RuntimeException("Monólito não encontrado");
        }
        monolitoRepository.deleteById(id);
    }

    public List<Monolito> buscarPorCollector(String collector) {
        return monolitoRepository.findByCollectorContainingIgnoreCase(collector);
    }

    public List<Monolito> buscarPorMetodo(String metodo) {
        return monolitoRepository.findByMetodoContainingIgnoreCase(metodo);
    }

    public List<String> listarMetodos() {
        return monolitoRepository.listarMetodosDistinct();
    }

    public List<Monolito> buscarMonolitosPorEspecie(String especie) {
        return tomboRepository.buscarMonolitosPorEspecie(especie);
    }

    /* ============================
       TOMBO (Monólito ↔ Espécie)
    ============================ */

    @Transactional
    public void adicionarEspecieComDados(
            Long monolitoId,
            Long especieId,
            Integer abundancia,
            String identificador
    ) {
        Monolito monolito = buscarPorId(monolitoId);

        Especie especie = especieRepository.findById(especieId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Espécie não encontrada")
                );

        if (tomboRepository.existsByIdentificador(identificador)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Identificador já cadastrado"
            );
        }

        Tombo tombo = new Tombo();
        tombo.setMonolito(monolito);
        tombo.setEspecie(especie);
        tombo.setAbundancia(abundancia);
        tombo.setIdentificador(identificador);

        tomboRepository.save(tombo);
    }

    public boolean existePorStationFieldNumber(String stationFieldNumber) {
        return monolitoRepository.existsByStationFieldNumber(stationFieldNumber);
    }

    public List<Tombo> listarTombos(Long monolitoId) {
        Monolito monolito = buscarPorId(monolitoId);
        return monolito.getTombos();
    }

    @Transactional
    public void removerTombo(Long tomboId) {
        if (!tomboRepository.existsById(tomboId)) {
            throw new RuntimeException("Registro de tombo não encontrado");
        }
        tomboRepository.deleteById(tomboId);
    }

    public List<Tombo> buscarTombosPorIdentificador(String identificador) {
        return tomboRepository.findByIdentificadorContainingIgnoreCase(identificador);
    }

    public boolean existeIdentificador(String identificador) {
        return tomboRepository.existsByIdentificador(identificador);
    }
}
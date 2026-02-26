package com.projeto.agroecologia.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Monolito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String stationFieldNumber;
    private Integer samplingNumber;
    private String metodo;
    private String profundidadeSolo;

    private Integer dia;
    private Integer mes;
    private Integer ano;

    private String collector;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @ManyToOne
    @JoinColumn(name = "localizacao_id")
    private Localizacao localizacao;

    @ManyToMany
    @JoinTable(
        name = "monolito_especie",
        joinColumns = @JoinColumn(name = "monolito_id"),
        inverseJoinColumns = @JoinColumn(name = "especie_id")
    )
    private List<Especie> especies;
}

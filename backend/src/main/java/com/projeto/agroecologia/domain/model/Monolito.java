package com.projeto.agroecologia.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
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

    @NotBlank
    @Column(nullable=false)
    private String stationFieldNumber;

    @NotNull
    @Column(nullable=false)
    private Integer samplingNumber;
    
    private String metodo;

    @NotBlank
    @Column(nullable=false)
    private String profundidadeSolo;

    private Integer dia;
    private Integer mes;
    private Integer ano;

    private String collector;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @OneToMany(mappedBy = "monolito", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tombo> tombos = new ArrayList<>();
}


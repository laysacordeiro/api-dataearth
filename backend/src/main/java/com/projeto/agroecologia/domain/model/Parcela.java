package com.projeto.agroecologia.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Parcela {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String proprietario;

    @Column(nullable = false)
    private String usoDaTerra;

    @Column(nullable = false)
    private LocalDate dataDoEvento;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "localidade_id", referencedColumnName = "id")
    private Localidade localidade;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "clima_id", referencedColumnName = "id")
    private Clima clima;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "environment_id", referencedColumnName = "id")
    private Environment environment;

    @OneToMany(mappedBy = "parcela", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Monolito> monolitos = new ArrayList<>();

    @Column(name = "description", length = 255)
    private String description;
}
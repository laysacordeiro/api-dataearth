package com.projeto.agroecologia.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tombo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tombo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "monolito_id")
    @JsonIgnore
    private Monolito monolito;

    @ManyToOne
    @JoinColumn(name = "especie_id")
    private Especie especie;

    @Column(nullable = false)
    private Integer abundancia;

    @Column(nullable = false)
    private String identificador;
}


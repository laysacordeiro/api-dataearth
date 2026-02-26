package com.projeto.agroecologia.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Localizacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String localidade;
    private String municipio;
    private String estado;
    private String pais;
    private String proprietarioTerreno;

    @OneToMany(mappedBy = "localizacao")
    @JsonIgnore
    private List<Monolito> monolitos;
}
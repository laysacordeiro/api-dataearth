package com.projeto.agroecologia.domain.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "especie")
public class Especie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(name = "nome_cientifico", nullable = false)
    private String nomeCientifico;

    @Column(nullable = false, length = 255)
    private String autor;

    private String ano;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "taxonomia_id")
    private Taxonomia taxonomia;

    @OneToMany(mappedBy = "especie")
    @JsonIgnore
    private List<Tombo> tombos;
}
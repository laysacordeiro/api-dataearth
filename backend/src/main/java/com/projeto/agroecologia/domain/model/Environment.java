package com.projeto.agroecologia.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Environment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vege_type", length = 255)
    private String vegeType;

    @Column(name = "prep_type", length = 255)
    private String prepType;

    @Column(name = "soil_type", length = 255)
    private String soilType;

    @Column(name = "current_vege", length = 255)
    private String currentVege;

    @Column(name = "original_vege", length = 255)
    private String originalVege;

    @Column(name = "vege_age")
    private Integer vegeAge;

    @Column(name = "biome", length = 255)
    private String biome;
}

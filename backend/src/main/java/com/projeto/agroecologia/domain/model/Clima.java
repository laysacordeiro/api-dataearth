package com.projeto.agroecologia.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Clima {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String clima_koppen;

    @Column(nullable = false)
    private Double avg_temp;

    @Column(nullable = false)
    private Double avg_precip;

    @Column(nullable = false)
    private String description;

}

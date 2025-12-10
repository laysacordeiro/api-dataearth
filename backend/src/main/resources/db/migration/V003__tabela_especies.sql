CREATE TABLE especie (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    nome_cientifico VARCHAR(255) NOT NULL,
    ano VARCHAR(10),
    descricao TEXT,
    taxonomia_id BIGINT,

    CONSTRAINT fk_especie_taxonomia
        FOREIGN KEY (taxonomia_id)
        REFERENCES taxonomia(id)
        ON DELETE RESTRICT
);

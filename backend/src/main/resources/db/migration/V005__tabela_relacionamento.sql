CREATE TABLE monolito_especie (
    monolito_id BIGINT NOT NULL,
    especie_id BIGINT NOT NULL,

    PRIMARY KEY (monolito_id, especie_id),

    FOREIGN KEY (monolito_id) REFERENCES monolito(id),
    FOREIGN KEY (especie_id) REFERENCES especie(id)
);

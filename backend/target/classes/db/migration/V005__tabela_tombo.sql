CREATE TABLE tombo (
    id BIGINT NOT NULL AUTO_INCREMENT,
    monolito_id BIGINT NOT NULL,
    especie_id BIGINT NOT NULL,
    abundancia INT NOT NULL,
    identificador VARCHAR(255) NOT NULL,

    PRIMARY KEY (id),

    CONSTRAINT uk_tombo_monolito_identificador UNIQUE (monolito_id, identificador),

    INDEX idx_tombo_monolito (monolito_id),
    INDEX idx_tombo_especie (especie_id),
    INDEX idx_tombo_identificador (identificador),

    CONSTRAINT fk_tombo_monolito
      FOREIGN KEY (monolito_id) REFERENCES monolito(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,

    CONSTRAINT fk_tombo_especie
      FOREIGN KEY (especie_id) REFERENCES especie(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
);
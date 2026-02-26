CREATE TABLE localizacao (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    localidade VARCHAR(255),
    municipio VARCHAR(255),
    estado VARCHAR(100),
    pais VARCHAR(100),
    proprietario_terreno VARCHAR(255)
);

CREATE TABLE monolito (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    station_field_number VARCHAR(100),
    sampling_number INT,
    metodo VARCHAR(50),
    profundidade_solo VARCHAR(50),

    dia INT,
    mes INT,
    ano INT,

    collector VARCHAR(255),
    remarks TEXT,

    localizacao_id BIGINT,

    CONSTRAINT fk_monolito_localizacao
        FOREIGN KEY (localizacao_id)
        REFERENCES localizacao(id)
);

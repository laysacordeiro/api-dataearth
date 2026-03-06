CREATE TABLE monolito (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Dados de Identificação (obrigatórios)
    station_field_number VARCHAR(100) NOT NULL,
    sampling_number INT NOT NULL,
    metodo VARCHAR(50) NOT NULL,
    profundidade_solo VARCHAR(50) NOT NULL,

    -- Data e Coleta (obrigatórios)
    dia INT NOT NULL,
    mes INT NOT NULL,
    ano INT NOT NULL,
    collector VARCHAR(255) NOT NULL,
    remarks TEXT,

    -- Unicidade
    CONSTRAINT uk_monolito_station_field_number UNIQUE (station_field_number)
);


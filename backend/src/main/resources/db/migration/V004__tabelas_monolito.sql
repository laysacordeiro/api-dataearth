CREATE TABLE monolito (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    station_field_number VARCHAR(255) NOT NULL,
    sampling_number INT NOT NULL,
    metodo VARCHAR(255),
    profundidade_solo VARCHAR(255) NOT NULL,

    dia INT,
    mes INT,
    ano INT,
    collector VARCHAR(255),
    remarks TEXT
);


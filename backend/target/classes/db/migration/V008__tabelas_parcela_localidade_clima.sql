CREATE TABLE localidade (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    locality VARCHAR(255) NOT NULL,
    county VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    continent VARCHAR(255) NOT NULL,
    latitude VARCHAR(255) NOT NULL,
    longitude VARCHAR(255) NOT NULL,
    name_uc VARCHAR(255) NOT NULL,
    class_uc VARCHAR(255) NOT NULL
);

CREATE TABLE clima (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    avg_temp DOUBLE NOT NULL,
    avg_precip DOUBLE NOT NULL,
    clima_koppen VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE environment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vege_type VARCHAR(255),
    prep_type VARCHAR(255),
    soil_type VARCHAR(255),
    current_vege VARCHAR(255),
    original_vege VARCHAR(255),
    vege_age INT,
    biome VARCHAR(255)
);

CREATE TABLE parcela (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    proprietario VARCHAR(255) NOT NULL,
    uso_da_terra VARCHAR(255) NOT NULL,
    data_do_evento DATE NOT NULL,
    description VARCHAR(255),
    localidade_id BIGINT,
    clima_id BIGINT,
    environment_id BIGINT,
    CONSTRAINT fk_parcela_localidade FOREIGN KEY (localidade_id) REFERENCES localidade(id),
    CONSTRAINT fk_parcela_clima FOREIGN KEY (clima_id) REFERENCES clima(id),
    CONSTRAINT fk_parcela_environment FOREIGN KEY (environment_id) REFERENCES environment(id)
);

ALTER TABLE monolito ADD COLUMN parcela_id BIGINT;
ALTER TABLE monolito ADD CONSTRAINT fk_monolito_parcela FOREIGN KEY (parcela_id) REFERENCES parcela(id);

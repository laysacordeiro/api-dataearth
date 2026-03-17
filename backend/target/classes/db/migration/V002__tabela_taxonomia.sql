CREATE TABLE taxonomia (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255),
    nivel VARCHAR(100),
    parent_id BIGINT,

    CONSTRAINT fk_taxonomia_parent
        FOREIGN KEY (parent_id)
        REFERENCES taxonomia(id)
        ON DELETE SET NULL
);

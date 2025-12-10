CREATE TABLE taxonomia (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    nivel VARCHAR(100) NOT NULL,
    parent_id BIGINT,

    CONSTRAINT fk_taxonomia_parent
        FOREIGN KEY (parent_id)
        REFERENCES taxonomia(id)
        ON DELETE SET NULL
);

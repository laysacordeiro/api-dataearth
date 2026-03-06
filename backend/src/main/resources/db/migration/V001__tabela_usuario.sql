CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- ============================
-- ROLES
-- ============================
INSERT INTO roles (name) VALUES ('ROLE_USER');
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');
INSERT INTO roles (name) VALUES ('ROLE_RESC');

-- ============================
-- USERS
-- ============================

INSERT INTO users (email, username, password, enabled)
VALUES (
    'admin@agroecologia.com',
    'Admin',
    '$2a$12$AciT1fRMShzxNYwttCsemOJl7bE29SZlVzsqagtMGRCjEDxFGKZqa',
    1
);

INSERT INTO user_roles (user_id, role_id)
VALUES (
    (SELECT id FROM users WHERE username = 'Admin'),
    (SELECT id FROM roles WHERE name = 'ROLE_ADMIN')
);

INSERT INTO users (email, username, password, enabled)
VALUES (
    'icaro@agroecologia.com',
    'Icaro de Jesus',
    '$2a$12$AciT1fRMShzxNYwttCsemOJl7bE29SZlVzsqagtMGRCjEDxFGKZqa',
    1
);

INSERT INTO user_roles (user_id, role_id)
VALUES (
    (SELECT id FROM users WHERE username = 'Icaro de Jesus'),
    (SELECT id FROM roles WHERE name = 'ROLE_RESC')
);

INSERT INTO users (email, username, password, enabled)
VALUES (
    'laysa@agroecologia.com',
    'Laysa Cordeiro',
    '$2a$12$AciT1fRMShzxNYwttCsemOJl7bE29SZlVzsqagtMGRCjEDxFGKZqa',
    1
);

INSERT INTO user_roles (user_id, role_id)
VALUES (
    (SELECT id FROM users WHERE username = 'Laysa Cordeiro'),
    (SELECT id FROM roles WHERE name = 'ROLE_RESC')
);
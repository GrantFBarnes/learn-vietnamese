-- Run to create db
-- mysql -u grant -p < setup.sql
-- mysqldump -u grant learn_vietnamese > backup.sql

DROP DATABASE IF EXISTS learn_vietnamese;
CREATE DATABASE learn_vietnamese;
USE learn_vietnamese;

CREATE TABLE cards (
    id INT NOT NULL AUTO_INCREMENT,
    word VARCHAR(32) NOT NULL,
    translation VARCHAR(128) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE examples (
    id INT NOT NULL AUTO_INCREMENT,
    card INT NOT NULL,
    example VARCHAR(128) NOT NULL,
    translation VARCHAR(256) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (card) REFERENCES cards(id) ON DELETE CASCADE
);

CREATE TABLE categories (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(64) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE cards_categories (
    id INT NOT NULL AUTO_INCREMENT,
    card INT NOT NULL,
    category INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (card) REFERENCES cards(id) ON DELETE CASCADE,
    FOREIGN KEY (category) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE connections (
    id INT NOT NULL AUTO_INCREMENT,
    ip VARCHAR(40) NOT NULL,
    url VARCHAR(128) NOT NULL,
    time DATETIME NOT NULL,
    PRIMARY KEY (id)
);

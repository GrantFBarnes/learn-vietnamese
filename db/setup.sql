-- Run to create db
-- mysql -u grant -p < setup.sql

DROP DATABASE IF EXISTS learn_vietnamese;
CREATE DATABASE learn_vietnamese;
USE learn_vietnamese;
CREATE TABLE flash_cards (
    id INT NOT NULL AUTO_INCREMENT,
    v_word VARCHAR(50) NOT NULL,
    e_word VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

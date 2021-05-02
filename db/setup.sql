-- Run to create db
-- mysql -u grant -p < setup.sql
DROP DATABASE IF EXISTS learn_vietnamese;
CREATE DATABASE learn_vietnamese;
USE learn_vietnamese;
CREATE TABLE cards (
    id INT NOT NULL AUTO_INCREMENT,
    word VARCHAR(20) NOT NULL,
    translation VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);
INSERT INTO cards (word, translation)
VALUES ("ai", "who");
INSERT INTO cards (word, translation)
VALUES ("anh", "older brother; you (male peer)");
INSERT INTO cards (word, translation)
VALUES ("áo khoác", "jacket");
INSERT INTO cards (word, translation)
VALUES ("ăn", "eat");
INSERT INTO cards (word, translation)
VALUES ("bạn", "friend");
INSERT INTO cards (word, translation)
VALUES ("bao nhiêu", "how much, how many");
INSERT INTO cards (word, translation)
VALUES ("bằng", "by (a certain means of transport)");
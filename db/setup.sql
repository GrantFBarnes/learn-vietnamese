-- Run to create db
-- mysql -u grant -p < setup.sql

DROP DATABASE IF EXISTS learn_vietnamese;
CREATE DATABASE learn_vietnamese;
USE learn_vietnamese;

CREATE TABLE cards (
    id INT NOT NULL AUTO_INCREMENT,
    word VARCHAR(20) DEFAULT "",
    translation VARCHAR(50) DEFAULT "",
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


CREATE TABLE examples (
    id INT NOT NULL AUTO_INCREMENT,
    card INT NOT NULL,
    example VARCHAR(60) DEFAULT "",
    translation VARCHAR(120) DEFAULT "",
    PRIMARY KEY (id),
    FOREIGN KEY (card) REFERENCES cards(id) ON DELETE CASCADE
);

INSERT INTO examples (card, example, translation)
VALUES (1, "Ai muốn uống trà?", "Who wants to drink tea?");
INSERT INTO examples (card, example, translation)
VALUES (1, "Ai đó?", "Who's that?");
INSERT INTO examples (card, example, translation)
VALUES (1, "Ai đến?", "Who's coming?");
INSERT INTO examples (card, example, translation)
VALUES (1, "Janet chờ ai?", "Who are you waiting for, Janet?");
INSERT INTO examples (card, example, translation)
VALUES (1, "Ai cũng vui!", "Everyone's happy!");

INSERT INTO examples (card, example, translation)
VALUES (2, "Anh là ai?", "Who are you?");
INSERT INTO examples (card, example, translation)
VALUES (2, "anh em", "siblings");
INSERT INTO examples (card, example, translation)
VALUES (2, "anh ruột", "older brother");
INSERT INTO examples (card, example, translation)
VALUES (2, "anh họ", "male cousin (of higher ranking than you (born to older sibling of parents))");
INSERT INTO examples (card, example, translation)
VALUES (2, "anh ấy", "he/him (when referring to your older brother or male peer)");

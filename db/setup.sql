-- Run to create db
-- mysql -u grant -p < setup.sql

DROP DATABASE IF EXISTS learn_vietnamese;
CREATE DATABASE learn_vietnamese;
USE learn_vietnamese;

CREATE TABLE cards (
    id INT NOT NULL AUTO_INCREMENT,
    word VARCHAR(20) NOT NULL,
    translation VARCHAR(50) NOT NULL,
    audio BLOB,
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


CREATE TABLE card_examples (
    id INT NOT NULL AUTO_INCREMENT,
    card INT NOT NULL,
    example VARCHAR(60) NOT NULL,
    translation VARCHAR(120) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (card) REFERENCES cards(id)
);

INSERT INTO card_examples (card, example, translation)
VALUES (1, "Ai muốn uống trà?", "Who wants to drink tea?");
INSERT INTO card_examples (card, example, translation)
VALUES (1, "Ai đó?", "Who's that?");
INSERT INTO card_examples (card, example, translation)
VALUES (1, "Ai đến?", "Who's coming?");
INSERT INTO card_examples (card, example, translation)
VALUES (1, "Janet chờ ai?", "Who are you waiting for, Janet?");
INSERT INTO card_examples (card, example, translation)
VALUES (1, "Ai cũng vui!", "Everyone's happy!");

INSERT INTO card_examples (card, example, translation)
VALUES (2, "Anh là ai?", "Who are you?");
INSERT INTO card_examples (card, example, translation)
VALUES (2, "anh em", "siblings");
INSERT INTO card_examples (card, example, translation)
VALUES (2, "anh ruột", "older brother");
INSERT INTO card_examples (card, example, translation)
VALUES (2, "anh họ", "male cousin (of higher ranking than you (born to older sibling of parents))");
INSERT INTO card_examples (card, example, translation)
VALUES (2, "anh ấy", "he/him (when referring to your older brother or male peer)");

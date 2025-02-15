-- Users begin
DROP TABLE IF EXISTS project_b_users;

CREATE TABLE IF NOT EXISTS project_b_users
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(32) UNIQUE NOT NULL,
    password    VARCHAR(128)       NOT NULL,
    first_name  VARCHAR(255)       NOT NULL,
    last_name   VARCHAR(255)       NOT NULL,
    birth       DATE               NOT NULL,
    description TEXT,
    avatar_path VARCHAR(255) DEFAULT '/images/avatars/avatar-default.jpg',
    is_deleted BOOLEAN,
    default_username VARCHAR(32) DEFAULT 'Anonymous User',
    default_avatar VARCHAR(255) DEFAULT '/images/avatars/avatar-default.jpg'
);

ALTER TABLE project_b_users ADD COLUMN is_deleted BOOLEAN DEFAULT false;
ALTER TABLE project_b_users ADD COLUMN default_username VARCHAR(32) DEFAULT 'Anonymous User';
ALTER TABLE project_b_users ADD COLUMN default_avatar VARCHAR(255) DEFAULT '/images/avatars/avatar-default.jpg';

INSERT INTO project_b_users (username, password, first_name, last_name, birth)
VALUES ('user1', 'password', 'Harry', 'Potter', '1990-01-01'),
       ('user2', 'password', 'James', 'Harden', '1985-01-01');
-- Users end

-- Articles begin
DROP TABLE IF EXISTS project_b_articles;

CREATE TABLE IF NOT EXISTS project_b_articles
(
    id           INT AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(64)                         NOT NULL,
    content      TEXT                                NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id      INT                                 NOT NULL,
    image_path   JSON,
    FOREIGN KEY (user_id) REFERENCES project_b_users (id) ON DELETE CASCADE
);

ALTER TABLE project_b_articles MODIFY COLUMN content TEXT NULL;

INSERT INTO project_b_articles (title, content, user_id)
VALUES ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        11),
       ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        9),
       ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        9),
       ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        9),
       ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        9),
       ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        9),
       ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        9),
       ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        9),
       ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        9),
       ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        9),
       ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        1);

INSERT INTO project_b_articles (title, content, user_id, image_path)
VALUES ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        11, '[
    "/images/test.png"
  ]'),
       ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        9, '[
         "/images/test.png",
         "/images/test.png"
       ]'),
       ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        9, '[
         "/images/test.png",
         "/images/test.png",
         "/images/test.png"
       ]'),
       ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        9, '[
         "/images/test.png",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png"
       ]'),
       ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        9, '[
         "/images/test.png",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png"
       ]'),
       ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        9, '[
         "/images/test.png",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png"
       ]'),
       ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        9, '[
         "/images/test.png",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png"
       ]'),
       ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        9, '[
         "/images/test.png",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png"
       ]'),
       ('What is Lorem Ipsum?',
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        9, '[
         "/images/test03.jpg",
         "/images/test01.jpg",
         "/images/test02.jpg",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png",
         "/images/test.png"
       ]');

DELETE FROM project_b_articles WHERE title='';
-- Articles end

-- Comments begin
DROP TABLE IF EXISTS project_b_comments;

CREATE TABLE IF NOT EXISTS project_b_comments
(
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT  NOT NULL,
    article_id   INT  NOT NULL,
    parent_id    INT,
    content      TEXT NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES project_b_users (id),
    FOREIGN KEY (article_id) REFERENCES project_b_articles (id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES project_b_comments (id) ON DELETE CASCADE
);

INSERT INTO project_b_comments (user_id, article_id, parent_id, content)
VALUES (3, 63, null, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd'),
       (2, 63, null, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd'),
       (10, 63, null, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd'),
       (11, 63, null, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd'),
       (11, 63, null, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd'),
       (5, 63, null, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd'),
       (10, 63, null, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd');

INSERT INTO project_b_comments (user_id, article_id, parent_id, content)
VALUES (3, 50, null, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd'),
       (2, 50, 5, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd'),
       (10, 50, 6, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd'),
       (10, 50, 6, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd'),
       (10, 50, 10, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd'),
       (5, 50, 9, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd'),
       (10, 50, 8, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd');

INSERT INTO project_b_comments (user_id, article_id, parent_id, content)
VALUES (3, 56, null, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd'),
       (2, 56, null, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd'),
       (10, 56, null, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd'),
       (10, 56, null, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd'),
       (10, 56, null, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd'),
       (5, 56, null, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd'),
       (10, 56, null, 'hello world hahaha sfsdffsadfadfsadfsafdssdfasadffsd');


SELECT created_time
FROM project_b_comments
WHERE id = 1;

SELECT CONVERT_TZ(c.created_time, '+00:00', '+13:00') AS created_time
FROM project_b_comments AS c
         JOIN project_b_users AS u ON c.user_id = u.id
WHERE c.article_id = 50
ORDER BY c.id ASC;

SELECT c.id,
       c.user_id,
       c.article_id,
       c.parent_id,
       c.content,
       CONVERT_TZ(c.created_time, '+00:00', '+00:00') AS created_time,
       u.username,
       u.avatar_path
From project_b_comments AS c
         JOIN project_b_users AS u ON c.user_id = u.id
WHERE c.article_id = 50
ORDER BY c.id ASC;

SELECT c.*, u.username, u.avatar_path
From project_b_comments AS c
         JOIN project_b_users AS u ON c.user_id = u.id
WHERE c.article_id = 50
ORDER BY c.id ASC;

SELECT CONVERT_TZ('2024-01-30 10:00:00', '+00:00', '+13:00');
-- Comments end

-- Likes begin
DROP TABLE IF EXISTS project_b_likes;

CREATE TABLE IF NOT EXISTS project_b_likes
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    article_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES project_b_users (id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES project_b_articles (id) ON DELETE CASCADE,
    CONSTRAINT UNIQUE (user_id, article_id)
);

INSERT INTO project_b_likes (user_id, article_id)
VALUES (1, 57),
       (2, 57),
       (3, 57),
       (4, 57),
       (5, 57),
       (6, 57),
       (7, 57),
       (1, 56),
       (2, 56),
       (3, 56),
       (4, 56),
       (5, 56),
       (6, 56),
       (10, 56);

SELECT COUNT(*) AS likeCount
FROM project_b_likes
WHERE article_id = 57;
SELECT id
FROM project_b_likes
WHERE article_id = 57
  AND user_id = 2
LIMIT 1;
-- Likes end

SELECT COUNT(*) AS count
FROM project_b_users
WHERE username = 'asdasd';

SELECT avatar_path
FROM project_b_users
WHERE id = 'XnkF-90sQCw__yfU_XiqKfD_BAEPOU80';

SELECT a.*
FROM project_b_articles AS a
         JOIN project_b_likes AS l ON a.id = l.article_id
WHERE l.user_id = 10;



DROP TABLE IF EXISTS project_b_likes;
DROP TABLE IF EXISTS project_b_comments;
DROP TABLE IF EXISTS project_b_articles;
DROP TABLE IF EXISTS project_b_users;





const database = require("./database.js");
const {limits} = require("argon2");

async function creatArticle(article) {
    const db = await database;
    const {title, content, userId, imagesPath} = article;

    const result = await db.query(
        "INSERT INTO project_b_articles (title, content, user_id, image_path) VALUES (?, ?, ?, ?)",
        [title, content, userId, imagesPath]);

    article.id = article.insertId;

    return article;
}

async function retrieveAllArticles() {
    const db = await database;

    return await db.query(
        'SELECT * FROM project_b_articles'
    )
}

async function retrieveNewArticlesWithoutId(limit) {
    const db = await database;

    return await db.query(
        'SELECT a.*, u.username, u.avatar_path, u.is_deleted, u.default_username, u.default_avatar FROM project_b_articles AS a JOIN project_b_users AS u ON a.user_id = u.id ORDER BY a.id DESC LIMIT ?',
        [limit]
    )
}

async function retrieveNewArticlesWithId(articleId, limit) {
    const db = await database;

    return await db.query(
        'SELECT a.*, u.username, u.avatar_path, u.is_deleted, u.default_username, u.default_avatar FROM project_b_articles AS a JOIN project_b_users AS u ON a.user_id = u.id WHERE a.id < ? ORDER BY a.id DESC LIMIT ?',
        [articleId, limit]
    )
}

async function retrieveMyArticlesById(userId){
    const db = await database;
    return await db.query(
        'SELECT * FROM project_b_articles WHERE user_id = ? ORDER BY updated_time DESC',
        [userId]
    )
}

async function retrieveMyLikesById(userId){
    const db = await database;
    return await db.query(
        'SELECT a.* FROM project_b_articles AS a JOIN project_b_likes AS l ON a.id = l.article_id WHERE l.user_id = ?;',
        [userId]
    )
}

async function retrieveSingleArticleById(articleId){
    const db = await database;
    const result =  await db.query(
        'SELECT a.*, u.username, u.avatar_path FROM project_b_articles AS a JOIN project_b_users AS u ON a.user_id = u.id WHERE a.id = ?',
        [articleId]
    );
    return result[0];
}

async function updateArticle(article){
    const db = await database;
    const {title, content, articleId, imagesPath} = article;
    const result =  await db.query(
        'UPDATE project_b_articles SET title = ?, content = ?, image_path = ? WHERE id = ?',
        [title, content, imagesPath, articleId]
    );
}

async function deleteArticleById(artilceId){
    const db = await database;
    const result =  await db.query(
        'DELETE FROM project_b_articles WHERE id = ?',
        [artilceId]
    );
}

module.exports = {
    creatArticle,
    retrieveAllArticles,
    retrieveNewArticlesWithId,
    retrieveNewArticlesWithoutId,
    retrieveMyArticlesById,
    retrieveMyLikesById,
    retrieveSingleArticleById,
    updateArticle,
    deleteArticleById
}
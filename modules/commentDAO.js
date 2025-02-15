const database = require("./database.js");

async function createComment(newComment) {
    const db = await database;
    console.log('newComment--5------------------------', newComment)
    const {user_id, article_id, parent_id, content} = newComment;

    const result = await db.query(
        "INSERT INTO project_b_comments (user_id, article_id, parent_id, content) VALUES (?, ?, ?, ?)",
        [user_id, article_id, parent_id, content]);

    newComment.id = result.insertId;

    return newComment;
}

async function retrieveCommentsByArticleId(idArr) {
    const db = await database;

    const result = [];
    for (let id of idArr) {
        const tempResult = await db.query(
            'SELECT c.*, u.username, u.avatar_path, u.is_deleted, u.default_username, u.default_avatar From project_b_comments AS c JOIN project_b_users AS u ON c.user_id = u.id WHERE c.article_id = ? ORDER BY c.id ASC',
            [id]
        );
        result.push(tempResult)
    }

    return result;
}

async function retrieveSingleCommentById(commentId) {
    const db = await database;
    const comment = await db.query(
        'SELECT * From project_b_comments WHERE id = ?',
        [commentId]
    )
    return comment[0];
}

async function deleteComment(commentId) {
    const db = await database;

    const result = await db.query(
        'DELETE FROM project_b_comments WHERE id = ?',
        [commentId]
    );
}

module.exports = {
    createComment,
    retrieveCommentsByArticleId,
    retrieveSingleCommentById,
    deleteComment
}

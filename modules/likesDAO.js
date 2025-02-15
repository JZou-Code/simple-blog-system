const database = require("./database.js");

async function createLike(userId, articleId) {
    const db = await database;
    const result = await db.query(
        'INSERT INTO project_b_likes (user_id, article_id) VALUES (?,?)',
        [userId, articleId]
    )
    return result
}

async function deleteLike(userId, articleId) {
    const db = await database;
    const result = await db.query(
        'DELETE FROM project_b_likes WHERE user_id = ? AND article_id = ?',
        [userId, articleId]
    )
}

async function retrieverLikesInfoByArticleId(articleIdArr) {
    const db = await database;
    const likesMap = new Map();

    for (let id of articleIdArr) {
        const likeCountResult = await db.query(
            'SELECT COUNT(*) AS likeCount FROM project_b_likes WHERE article_id = ?',
            [id]
        );
        likesMap.set(id, Number(likeCountResult[0].likeCount));
    }
    return Object.fromEntries(likesMap);
}

async function retrieveIsUserLikedState(articleIdArr, userId){
    const db = await database;
    const stateMap = new Map();
    console.log('articleIdArr-----------',articleIdArr)
    console.log('userId-----------',userId)
    for (let id of articleIdArr) {
        const likeCountResult = await db.query(
            'SELECT id FROM project_b_likes WHERE article_id = ? AND user_id = ?;',
            [id, userId]
        );
        if(likeCountResult.length > 0){
            stateMap.set(id, true);
        }else {
            stateMap.set(id, false);
        }
    }
    return Object.fromEntries(stateMap);
}

module.exports = {
    createLike,
    deleteLike,
    retrieverLikesInfoByArticleId,
    retrieveIsUserLikedState
}
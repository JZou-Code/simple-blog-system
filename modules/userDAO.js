const database = require("./database.js");

async function createUser(user) {
    const db = await database;
    const {username, password, fname, lname, birth, description} = user;

    const result = await db.query(
        "INSERT INTO project_b_users (username, password, first_name, last_name, birth, description ) VALUES (?, ?, ?, ?, ?, ?)",
        [username, password, fname, lname, birth, description]);

    user.id = result.insertId;

    return user;
}

async function isUsernameAvailable(username) {
    const db = await database;
    // console.log('nihao', username)
    const result = await db.query(
        'SELECT COUNT(*) AS count FROM project_b_users WHERE username = ?',
        [username]
    )
    // console.log('result',result)
    return result[0].count === 0n;
}

async function retrieveUserInfoById(userId) {
    const db = await database;
    const result = await db.query(
        'SELECT username, avatar_path FROM project_b_users WHERE id = ?',
        [username]
    )
    return result[0]
}

async function retrievePwdAndIdByUsername(username) {
    const db = await database;
    const result = await db.query(
        'SELECT id, password, is_deleted FROM project_b_users WHERE username = ?',
        [username]
    )
    return result[0]
}

async function retrieveImgByUserId(userId) {
    const db = await database;
    const result = await db.query(
        'SELECT avatar_path FROM project_b_users WHERE id = ?',
        [userId]
    )
    return result[0];
}

async function retrieveUserByUserId(userId) {
    const db = await database;
    const result = await db.query(
        'SELECT username, first_name, last_name, DATE_FORMAT(birth, "%Y-%m-%d") AS birth, description, avatar_path FROM project_b_users WHERE id = ?',
        [userId]
    )

    return result[0]
}

async function updateUserProfile(user, userId) {
    const db = await database;
    const {username, fname, lname, birth, description} = user;

    // const birthInDate = new Date(birth);
    // const birthInUTC = birthInDate.toISOString().split('T')[0]

    // console.log('birthInUTC', birthInUTC)

    console.log('birth', birth)

    await db.query(
        'UPDATE project_b_users SET username = ?, first_name = ?, last_name = ?, birth = ?, description=? WHERE id = ?',
        [username, fname, lname, birth, description, userId]
    )
}

async function updateUserAvatarPath(path, userId) {
    const db = await database;

    await db.query(
        'UPDATE project_b_users SET avatar_path = ? WHERE id = ?',
        [path, userId]
    )
}

async function updateUserPassword(password, userId) {
    const db = await database;

    await db.query(
        'UPDATE project_b_users SET password = ? WHERE id = ?',
        [password, userId]
    )
}

async function deleteUser(userId){
    const db = await database;

    const result = await db.query(
        'UPDATE project_b_users SET is_deleted = ? WHERE id = ?',
        [true, userId]
    )

    return result;
}

module.exports = {
    createUser,
    isUsernameAvailable,
    retrievePwdAndIdByUsername,
    retrieveImgByUserId,
    retrieveUserInfoById,
    updateUserProfile,
    updateUserAvatarPath,
    retrieveUserByUserId,
    updateUserPassword,
    deleteUser
};

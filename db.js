const mysql = require('mysql2/promise');
require('dotenv').config();


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

async function saveStories(stories) {

    const connection = await pool.getConnection();
    try {
        for (const story of stories) {
            console.log(story)
            await connection.query(
                'INSERT IGNORE INTO stories (title, url) VALUES (?, ?)',
                [story.title, story.url]
            );
        }
    } finally {
        connection.release();
    }
}

module.exports = { saveStories, pool };

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
        if (stories.length === 0) return; 
        const values = stories.map(({ id, title, url, time }) => [
            id, 
            title || 'No title available', 
            url || 'No URL available', 
            new Date(time * 1000), 
        ]);
        const query = `
            INSERT INTO stories (id, title, url, time)
            VALUES ?
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                url = VALUES(url),
                time = VALUES(time);
        `;

        await connection.query(query, [values]);
    } catch (error) {
        console.error('Error saving stories:', error);
    } finally {
        connection.release();
    }
}

module.exports = { saveStories, pool };

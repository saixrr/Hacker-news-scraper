const { pool } = require('../db'); // Use CommonJS imports consistently

const getStories = async (req, res) => {
    try {
        // Retrieve the latest 10 stories from the database
        const [rows] = await pool.query(`
            SELECT title, url, time 
            FROM stories 
            ORDER BY time DESC 
            LIMIT 10
        `);
        res.status(200).json({ success: true, stories: rows });
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = getStories; // Correct export

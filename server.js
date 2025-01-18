const express = require('express');
const WebSocket = require('ws');
const fetchStories = require('./scraper');
const { saveStories, pool } = require('./db');
const cors = require('cors');


const app = express();
const port = 3000;
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001' }));

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', async (ws) => {
    try {
        // Send the number of stories published in the last 5 minutes
        const [rows] = await pool.query(`
            SELECT COUNT(*) AS count 
            FROM stories 
            WHERE time > NOW() - INTERVAL 5 MINUTE
        `);
        ws.send(JSON.stringify({ recentStoriesCount: rows[0].count }));

        ws.on('close', () => console.log('WebSocket client disconnected'));
    } catch (error) {
        console.error('Error sending recent stories count:', error);
    }
});

// Periodically scrape and broadcast new stories
setInterval(async () => {
    try {
        const stories = await fetchStories();
        await saveStories(stories);
      

        // Broadcast new stories
        const message = JSON.stringify({ type: 'NEW_STORIES', stories });
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    } catch (error) {
        console.error('Error during periodic scraping:', error);
    }
}, 10000); // Every 10 seconds

app.get('/', async (req, res) => {
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
});

// Upgrade HTTP requests to WebSocket
const server = app.listen(port, () => console.log(`Server running on port ${port}`));
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

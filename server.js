/* server.js */
const express = require('express');
const WebSocket = require('ws');
const fetchStories = require('./scraper');
const { saveStories, pool } = require('./db');
const cors = require('cors');
const router = require('./routes/routes');

const app = express();
const port = 5002;
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

const wss = new WebSocket.Server({ noServer: true });

let latestTimestamp = 0; // To track the latest story timestamp

wss.on('connection', async (ws) => {
    try {
        // Fetch recent stories from the database
        const [rows] = await pool.query(`
            SELECT id, title, url, time 
            FROM stories 
            WHERE time > NOW() - INTERVAL 5 MINUTE 
            ORDER BY time DESC
        `);

        
        // Set the latest timestamp from the fetched stories
        if (rows.length > 0) {
            latestTimestamp = rows[0].time;
        }

        // Send initial stories
        ws.send(JSON.stringify({ type: 'INITIAL_STORIES', stories: rows }));
    } catch (error) {
        console.error('Error sending recent stories count:', error);
    }
});

// Periodically scrape and broadcast new stories
setInterval(async () => {
    try {
        const newStories = await fetchStories(latestTimestamp); 
        
        console.log("new stories",newStories)// Pass latestTimestamp to fetch only newer stories

        if (newStories.length > 0) {
            // Save new stories to the database
            await saveStories(newStories);

            // Update the latestTimestamp
            latestTimestamp = Math.max(...newStories.map(story => story.time)); // Update to the latest time from the fetched stories

            // Broadcast only new stories to connected clients
            const message = JSON.stringify({ type: 'NEW_STORIES', stories: newStories });
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        }
    } catch (error) {
        console.error('Error during periodic scraping:', error);
    }
}, 10000); // Every 10 seconds
// Every 10 seconds

app.use(router);

// Upgrade HTTP requests to WebSocket
const server = app.listen(port, () => console.log(`Server running on port ${port}`));
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});



This project is a Node.js service that scrapes real-time data from Hacker News and streams it to connected clients via WebSocket. The scraped data is stored in a MySQL database, and the latest stories published in the last 5 minutes are sent to clients on their initial connection.

**Prerequisites**
Ensure you have the following installed:

Node.js (version 14.x or higher): Download Node.js
MySQL (for data storage)
NPM or Yarn (for package management): Install NPM
Git (for cloning the repository)

**Setup**
Clone the Repository

git clone https://github.com/saixrr/Hacker-news-scraper.git
cd <repo_name>


**Backend Setup**
npm install
Start the backend:
npm start
The backend will start running on port 5002.

**Frontend Setup:**
Navigate to the frontend directory:
cd frontend
Install dependencies:
npm install
Start the frontend:
npm start
The frontend will start running on port 3000.

Note: If you choose to use a different port, update the origin in server.js to avoid CORS errors.
Database Setup
Define your database credentials in a .env file at the root of the project:

DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=hacker_news

Create the database and tables by executing the init.sql file:
Navigate to the folder containing the init.sql file.
Run the following command:
mysql -u root -p < init.sql
Note: Ensure MySQL is installed and running, and that you have set a root password.

Starting MySQL Services
On Mac:
brew services start mysql
On Windows:
mysqld --console


The WebSocket provides real-time updates of new stories from Hacker News. Upon connection:

It sends the stories published in the last 5 minutes.
It broadcasts any new stories that are scraped periodically.
Client-Side Usage: Here's an example of how to connect to the WebSocket using JavaScript:

const socket = new WebSocket('ws://localhost:5002');

socket.onopen = () => {
  console.log('WebSocket connection established');
};

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.type === 'INITIAL_STORIES') {
    console.log('Stories from the last 5 minutes:', message.stories);
  }

  if (message.type === 'NEW_STORIES') {
    console.log('New stories:', message.stories);
  }
};

socket.onclose = () => {
  console.log('WebSocket connection closed');
};

socket.onerror = (error) => {
  console.error('WebSocket error:', error);
};


REST API Example:
The REST API allows clients to fetch stories manually.
Endpoint: GET /getstories

Example Request:
curl http://localhost:5002/getstories
Example Response:

[
  {
    "id": 42756734,
    "title": "Trump launched an election memecoin [video]",
    "url": "https://www.youtube.com/watch?v=8zjBj194el8",
    "time": 1737292960
  },
  {
    "id": 42756724,
    "title": "Coinbase added the official Trump token in Solana",
    "url": "https://www.coinbase.com/blog/increasing-transparency-for-new-asset-listings-on-coinbase",
    "time": "2025-01-19T13:20:46.000Z"
  }
]

Client-Side Fetch Example:
fetch('http://localhost:5002/getstories')
  .then(response => response.json())
  .then(data => {
    console.log('Fetched stories:', data);
  })
  .catch(error => {
    console.error('Error fetching stories:', error);
  });
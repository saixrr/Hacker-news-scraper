
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

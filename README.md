This Project is a node.js service which scrapes the real-time data from hacker News and streams them via websocket to connected clients. 
It stores the scraped data in a MySQL database and sends the latest stories published in the last 5 minutes to clients on initial connection.

**Prerequisites:** 
Node.js (version 14.x or higher) : https://nodejs.org/en
MySQL (for data storage)
NPM or Yarn (for package management): https://www.geeksforgeeks.org/how-to-download-and-install-node-js-and-npm/
Git (for cloning the repository)


**SETUP:**
git clone https://github.com/saixrr/Hacker-news-scraper.git
cd <repo_name>

Backend setup:
npm i
npm start

backend starts running in the port 5002

frontend setup:
cd frontend
npm i
npm start

frontend starts running in port 3000(Note: change the origin in server.js if you want to use other port to not get cors error)


**DATABASE SETUP:**
define your credntials in .env file like below:
DB_HOST=127.0.0.1

DB_USER=root
DB_PASS=******
DB_NAME=hacker_news

**To create database execute init.sql file**
navigate to folder which holds init.sql and execute
mysql -u root -p < init.sql
Note: make sure mysql is installed and password is set 
do not forget to start my sql service 

In Mac:
brew services start mysql

In windows:
mysqld --console












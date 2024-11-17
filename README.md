# Server-discord-bot
A multipurpose bot built using the Discord.js API module

## Requirements

- [Node.js](https://nodejs.org/) (version 16.6.0 or higher)
- A [Discord Developer Application](https://discord.com/developers/applications) for bot setup
- [MySQL](https://www.mysql.com/) database setup (optional, if the bot interacts with a database)

## Setup Instructions

Follow these steps to get the bot up and running:

### 1. Clone the Repository
Clone this repository to your local machine:
   ```bash
   git clone https://github.com/marck001/Server-discord-bot.git
   cd server-discord-bot
   ```

### 2. Install Dependencies
Install the required Node.js packages using npm:
   ```bash
   npm install
   ```

### 3. Create an `.env` File
Create a `.env` file in the root directory to store your bot credentials and database information.

   **Sample `.env` file:**
   ```env
   # Discord Bot Credentials
   TOKEN=YOUR_BOT_TOKEN
   GUILD_ID=YOUR_GUILD_ID
   CLIENT_ID=YOUR_BOT_ID
   CHANNEL_ID=YOUR_CHANEL_ID_FOR_STREAK

   # Database Credentials (optional)
   DB_HOST=YOUR_DB_HOST
   DB_PORT=YOUR_DB_PORT
   DB_USER=YOUR_DB_USER
   DB_PASSWORD=YOUR_DB_PASSWORD
   DB_NAME=YOUR_DB_NAME
   ```


### 4. Run the Bot
Start the bot with the following command:
   ```bash
   node index.js
   ```

   If you're using [nodemon](https://www.npmjs.com/package/nodemon) for development, you can start the bot with:
   ```bash
   npx nodemon index.js
   ```
   short way
    ```bash
   nodemon 
   ```

## Contributing:
Contributions from everyone are welcome. Feel free to submit pull requests, report issues, or contribute in any other way that aligns with the project.

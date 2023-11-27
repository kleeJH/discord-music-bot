# Discord Music Bot
This is a discord music bot that uses the official discord API and discord-player. It has various slash commands that can help you to manage the music bot. The bot also responds with pleasing and helpful visual to help with providing good user experience.

## Installation
1) Follow a guide to create a discord bot account (with adminstrator permissions) using the Discord Developer Platform
2) Create a .env file with the following variables
   - `DISCORD_BOT_TOKEN` (the bot's token retrieved from the Discord Developer Portal)
   - `DISCORD_BOT_ID` (the bot's client id)
   - `DISCORD_GUILD_ID` (your server's guild/server id)
3) Install the dependencies using `npm i`
4) Finally, do `npm run start` to run the node project. If you are developing, use `npm run dev` to enable nodemon

## Additional Information
- If you would like to change to a different opus library or would like to test different YouTube streaming libraries, take a look at this [link](https://discord-player.js.org/guide/welcome/welcome) to see supported packages to install.

## Bugs
- As of 27/11/2023, the discord-player's repeat mode (for queue and song repeat) is implemented incorrectly. So, a bootleg version of it was implement. If there is a fix to it, there might be an update to this repository to fix those issues.
- Getting the link to the lyrics of the song is implemented poorly. Sometimes it will link to the wrong song.
- Feel free to modify the code if there is something wrong with the implementation.
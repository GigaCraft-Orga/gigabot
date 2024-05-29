const { Client, GatewayIntentBits } = require('discord.js');
const path = require('node:path');
const { deployEvents } = require("./utils/deploy-events");
const database = require("./database/database");
const {deployCommands} = require("./utils/deploy-commands");
require('dotenv').config();

console.log("Starting bot...");

const client = new Client({
    intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    ]});

database.connect();

// Command deployment
deployCommands(client, path.join(__dirname, 'commands'));

// Event deployment
deployEvents(client, path.join(__dirname, 'events'));

client.login(process.env.TOKEN);
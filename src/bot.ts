import { Client, Events, GatewayIntentBits } from "discord.js";

require('dotenv').config()

const token = process.env.TOKEN;

// Client creation & starting
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, readyClient => {
    console.log(`Botcii is ready!`);
});

client.login(token);
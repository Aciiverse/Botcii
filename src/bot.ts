import { CacheType, ChatInputCommandInteraction, Client, Events, GatewayIntentBits } from "discord.js";
import { RegCmds } from "./lib/reg-cmds";
import fs = require('fs');

require('dotenv').config();

interface CmdMap {
    [cmdName: string]: (interaction: ChatInputCommandInteraction<CacheType>) => any;
}

const token = process.env.TOKEN;

// Client creation & starting
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// Update the registered commands
RegCmds.updateCmnds();

// Client successfully started check
client.on(Events.ClientReady, (client) => {
    console.log(`✅ ${client.user.tag} is online`);
});

// Handle client interaction
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        // -> Unknown command -> Error & Return
        console.error("Interaction unknown")
        return;
    }
    const   cmd     = interaction.commandName,
            path    = `${__dirname}/commands/${cmd}.js`;

    try {

        if (!fs.existsSync(path)) {
            // -> path not exists
            console.error("command not exists");
            return;
        }

        const   commandModule   = await import(path),
                cmdFunction     = (commandModule as CmdMap)[cmd];

        if (typeof(cmdFunction) !== "function") {
            // -> command has not a function -> Error
            console.error("Not a function");
            return;
        }

        return await cmdFunction(interaction);

    } catch (error) {
        // -> Catch unexpected error
        console.error(error);

    }
});

client.login(token);
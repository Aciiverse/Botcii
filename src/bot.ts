import { CacheType, ChatInputCommandInteraction, Client, Events, GatewayIntentBits } from "discord.js";
import { RegCmds } from "./lib/reg-cmds";
import fs = require('fs');
import { I18nSW } from "./lib/i18n.sw";

require('dotenv').config();

interface CmdMap {
    [cmdName: string]: (interaction: ChatInputCommandInteraction<CacheType>) => any;
}

const token = process.env.TOKEN;

// Client creation & starting
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// Test i18nSW
console.log(I18nSW.getText("I18nSWLoaded"));

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
        console.error(I18nSW.getText("errUnknInteraction"));
        return;
    }
    const   cmd     = interaction.commandName,
            path    = `${__dirname}/commands/${cmd}.js`;

    try {

        if (!fs.existsSync(path)) {
            // -> path not exists
            const msg = I18nSW.getText("errUnknCmd");
            interaction.reply(msg);
            console.error(msg);
            return;
        }

        const   commandModule   = await import(path),
                cmdFunction     = (commandModule as CmdMap)[cmd];

        if (typeof(cmdFunction) !== "function") {
            // -> command has not a function -> Error
            const msg = I18nSW.getText("errUnknCmd");
            console.error(msg);
            interaction.reply(msg);
            return;
        }

        return await cmdFunction(interaction);

    } catch (error) {
        // -> Catch unexpected error
        console.error(error);
        interaction.reply(I18nSW.getText("err"));
    }
});

client.login(token);
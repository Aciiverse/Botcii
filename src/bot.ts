import { CacheType, ChannelSelectMenuInteraction, ChatInputCommandInteraction, Client, Events, GatewayIntentBits, MessageContextMenuCommandInteraction } from "discord.js";
import { RegCmds } from "./lib/reg-cmds";
import fs = require('fs');
import { I18nSW } from "./lib/i18n.sw";
import { db } from "./lib/db";

require('dotenv').config();

interface CmdMap {
    [cmdName: string]: (
        client: Client<boolean>,
        interaction: ChatInputCommandInteraction<CacheType> | MessageContextMenuCommandInteraction<CacheType> | ChannelSelectMenuInteraction<CacheType>
    ) => any;
}

const token = process.env.TOKEN;

// Client creation & starting
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
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
    let cmd: string;

    if (!interaction.isChatInputCommand() && !interaction.isMessageContextMenuCommand() && !interaction.isChannelSelectMenu()) {
        // -> Unknown command -> Error & Return
        console.error(I18nSW.getText("errUnknInteraction", { lang: interaction.locale }));
        return;
    }

    if (interaction.isChannelSelectMenu()) {
        // -> select menu interaction
        const   customID = interaction.customId,
                fileKey = customID.split("-")[0]

        cmd = fileKey;
    } else {
        // -> chat input or context menu interactiob
        cmd = interaction.commandName;
    }

    const path = `${__dirname}/commands/${cmd}.js`;

    try {

        if (!fs.existsSync(path)) {
            // -> path not exists
            const msg = I18nSW.getText("errUnknCmd", { lang: interaction.locale });
            interaction.reply(msg);
            console.error(msg);
            return;
        }

        const commandModule = await import(path);
        let functionName: string;

        if (interaction.isChannelSelectMenu()) {
            // -> select menu interaction
            const   customID    = interaction.customId,
                    funcKey     = customID.split("-")[1]
    
            functionName = funcKey;
        } else {
            // -> chat input or context menu interactiob
            functionName = cmd;
        }
        
        
        const cmdFunction = (commandModule as CmdMap)[functionName];

        if (typeof(cmdFunction) !== "function") {
            // -> command has not a function -> Error
            const msg = I18nSW.getText("errUnknCmd", { lang: interaction.locale });
            console.error(msg);
            interaction.reply(msg);
            return;
        }

        return await cmdFunction(client, interaction);

    } catch (error) {
        // -> Catch unexpected error
        console.error(error);
        interaction.reply(I18nSW.getText("err", { lang: interaction.locale }));
    }
});

// Handle User Voice Channel join / Leave
client.on(Events.VoiceStateUpdate, (oldState, newState) => {
    if (oldState.channel) {
        // -> user leaves a channel
        // console.log("User leaves a channel");

    }
    
    if (newState.channel) {
        // -> user joins a channel
        console.log("User joins a channel");
        
    }
});

// No crash by error
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception: ', error);
});

client.login(token);
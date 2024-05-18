import { REST, Routes } from "discord.js"
import config from "../config.json"

require('dotenv').config();

export module RegCmds {

    /**
     * @async
     * @method updates all commands for the bot
     * @returns {Promise<void>}
     * @author Flowtastisch
     * @memberof ScriptWerk
     * @date 19.05.2024
     */
    export async function updateCmnds (): Promise<void> {

        const   cmds        = config.commands,
                token       = process.env.TOKEN,
                clientID    = process.env.CLIENTID,
                guildID     = process.env.GUILDID;

        if (typeof(token) !== "string") {
            // -> token is unvalid
            console.error("token unvalid");
            return;
        } else if (typeof(clientID) !== "string") {
            // -> client id is unvalid
            console.error("client id unvalid");
            return;
        } else if (typeof(guildID) !== "string") {
            // -> guild id is unvalid
            console.error("guild id unvalid");
            return;
        }

        const rest = new REST().setToken(token);

        try {

            await rest.put(Routes.applicationGuildCommands(clientID, guildID),
                {
                    body: cmds
                });

            console.log("Commands successfully registered");

        } catch (error) {
            // -> Error occured
            console.error(error);
            
        }

    };
}

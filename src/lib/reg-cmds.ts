import { REST, Routes, SlashCommandBuilder } from "discord.js"
import config from "../config";

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
        const   mode        = process.env.MODE,
                cmds        = config.commands,
                token       = process.env.TOKEN,
                clientID    = process.env.CLIENTID;

        if (typeof(token) !== "string") {
            // -> token is unvalid
            console.error("token unvalid");
            return;
        } else if (typeof(clientID) !== "string") {
            // -> client id is unvalid
            console.error("client id unvalid");
            return;
        }

        const rest = new REST().setToken(token);

        switch (mode) {
            case "PROD":
                // -> PRODUCTION Mode -> PUBLIC command
                try {
                    await rest.put(Routes.applicationCommands(clientID),
                        {
                            body: cmds
                        }
                    );

                    console.log("Commands successfully globally registered");
                } catch (error) {
                    // -> Error occured
                    console.error(error);
                    
                }
                break;
            
            case "DEV":
                // -> LOCAL DEV mode -> GUILD command
                const guildID = process.env.GUILDID;

                if (typeof(guildID) !== "string") {
                    // -> guild id is unvalid
                    console.error("guild id unvalid");
                    return;
                }

                try {
                    await rest.put(Routes.applicationGuildCommands(clientID, guildID),
                        {
                            body: cmds
                        }
                    );

                    console.log("Commands successfully for guild registered");
                } catch (error) {
                    // -> Error occured
                    console.error(error);
                    
                }
                break;        
        }
    };
}

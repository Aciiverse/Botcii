import { ApplicationCommandType, RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import { I18nSW } from "./lib/i18n.sw";

interface CommandsConfig {
    commands: RESTPostAPIChatInputApplicationCommandsJSONBody[]
}

const commandsConfig: CommandsConfig = {
    commands: [
        {
            name: "hi",
            description: I18nSW.getText("cmdHiDescr"),
            type: ApplicationCommandType.ChatInput
        }
    ]
};

export default commandsConfig
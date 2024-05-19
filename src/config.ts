import { ApplicationCommandType, RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";

interface BotciiConfig {
    commands: RESTPostAPIChatInputApplicationCommandsJSONBody[]
}

const config: BotciiConfig = {

    commands: [
        {
            name: "hi",
            description: "Say hello to Botcii 🥑🙂",
            type: ApplicationCommandType.ChatInput
        }
    ]

};

export default config
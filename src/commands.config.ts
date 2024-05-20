import { ApplicationCommandOptionType, ApplicationCommandType, PermissionFlags, PermissionFlagsBits, RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";

interface CommandsConfig {
    commands: RESTPostAPIChatInputApplicationCommandsJSONBody[]
}

const commandsConfig: CommandsConfig = {
    commands: [
        {
            name: "hi",
            description: "Say hello to Botcii 🥑🙂!",
            type: ApplicationCommandType.ChatInput,
            description_localizations: {
                de: "Sag hallo zu Botcii 🥑🙂!"
            }
        },
        {
            name: "write",
            description: "Let Botcii write a message in a selected channel!",
            type: ApplicationCommandType.ChatInput,
            default_member_permissions: PermissionFlagsBits.Administrator.toString(),
            name_localizations: {
                de: "schreibe"
            },
            description_localizations: {
                de: "Lass Botcii eine Nachricht in einen ausgewählten Channel schreiben!"
            },
            options: [
                {
                    name: "channel",
                    description: "The channel in which the message is to be displayed",
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                    name_localizations: {
                        de: "kanal"
                    },
                    description_localizations: {
                        de: "Der Channel, in dem die Nachricht angezeigt werden soll"
                    }
                },
                {
                    name: "message",
                    description: "Displayed message",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    name_localizations: {
                        de: "nachricht"
                    },
                    description_localizations: {
                        de: "Zu sendene Nachricht"
                    }
                }
            ]
        }
    ]
};

export default commandsConfig
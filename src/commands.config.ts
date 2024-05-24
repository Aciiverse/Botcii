import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, PermissionFlagsBits, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";

interface CommandsConfig {
    commands: RESTPostAPIApplicationCommandsJSONBody[]
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
                        de: "channel"
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
        },
        {
            name: "copyMessage",
            type: ApplicationCommandType.Message,
            default_member_permissions: PermissionFlagsBits.Administrator.toString(),
            name_localizations: {
                de: "kopiereNachricht"
            }
        },
        {
            name: "autochannel",
            description: "AutoChannel mdule",
            type: ApplicationCommandType.ChatInput,
            default_member_permissions: PermissionFlagsBits.Administrator.toString(),
            name_localizations: {
                de: "autochannel"
            },
            description_localizations: {
                de: "AutoChannel Modul"
            },
            options: [
                {
                    name: "add",
                    description: "Add a new channel for automatic channel creation.",
                    type: ApplicationCommandOptionType.Subcommand,
                    name_localizations: {
                        de: "hinzufügen"
                    },
                    description_localizations: {
                        de: "Füge einen neuen Channel für die automatische Channelerstellung hinzu."
                    },
                    options: [
                        {
                            name: "joinchannel",
                            description: "The channel that users enter to create a channel.",
                            type: ApplicationCommandOptionType.Channel,
                            channel_types: [ChannelType.GuildVoice],
                            required: true,
                            name_localizations: {
                                de: "joinchannel"
                            },
                            description_localizations: {
                                de: "Der Channel, den die User betreten, um einen Channel zu erstellen."
                            }
                        },
                        {
                            name: "targetcategory",
                            description: "The target category, where the channel should appear.",
                            type: ApplicationCommandOptionType.Channel,
                            channel_types: [ChannelType.GuildCategory],
                            required: true,
                            name_localizations: {
                                de: "zielkategorie"
                            },
                            description_localizations: {
                                de: "Die Zielkategory, wo der Channel erscheinen soll."
                            }
                        }
                    ]
                },
                {
                    name: "list",
                    description: "List of all autochannel configurations.",
                    type: ApplicationCommandOptionType.Subcommand,
                    name_localizations: {
                        de: "liste"
                    },
                    description_localizations: {
                        de: "Liste von allen autoChannel Konfigurationen."
                    },
                }
            ]
            
        }
    ]
};

export default commandsConfig;
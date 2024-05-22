import { BaseGuildTextChannel, CacheType, ChatInputCommandInteraction, Client, MessageContextMenuCommandInteraction, PermissionFlagsBits } from "discord.js";
import { I18nSW } from "../lib/i18n.sw";

/**
 * @method handels the /write command
 * @param {Client<boolean>} client the client property
 * @param {ChatInputCommandInteraction<CacheType>} interaction client interaction -> slash command
 * @author Flowtastisch
 * @memberof ScriptWerk
 * @date 19.05.2024
 */
export function write (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType> | MessageContextMenuCommandInteraction<CacheType>) {
    const   optionsData = interaction.options.data,
            channelOpt  = optionsData.find(e => e.name === "channel"),
            messageOpt  = optionsData.find(e => e.name === "message"),
            channelID   = channelOpt?.value;

    // Validation:
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        // -> is not admin
        const errMsg = I18nSW.getText("errNoPerm", { lang: interaction.locale });
        console.error(errMsg)
        interaction.reply(errMsg);
        return;
    }
    
    if (messageOpt?.value === "") {
        // -> given message is invalid (empty) -> Error
        const errMsg = I18nSW.getText("errEmptyProperty", {
            lang: interaction.locale,
            values: [messageOpt.name]
        });
        interaction.reply(errMsg);
        console.error(errMsg);
        return;
    }

    if (typeof(channelID) !== "string") {
        // -> Channel is not valid
        const errMsg = I18nSW.getText("errInvalidChannel", { lang: interaction.locale });
        interaction.reply(errMsg);
        console.error(errMsg);
        return;

    } else if (typeof(messageOpt?.value) !== "string") {
        // -> Message is not valid
        const errMsg = I18nSW.getText("errEmptyProperty", {
            lang: interaction.locale,
            values: [messageOpt?.name!]
        });
        interaction.reply(errMsg);
        console.error(errMsg);
        return;
    }

    // Get Channel & Validate
    const channel = client.channels.cache.get(channelID) as BaseGuildTextChannel | undefined;

    if (channel?.guildId !== interaction.guildId) {
        // -> Channel is from another server
        const errMsg = I18nSW.getText("errInvalidChannel", { lang: interaction.locale });
        interaction.reply(errMsg);
        console.error(errMsg);
        return;
    }

    channel.send(messageOpt?.value);
    interaction.reply(I18nSW.getText("sucMessageSended", { lang: interaction.locale }));
}
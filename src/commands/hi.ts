import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { I18nSW } from "../lib/i18n.sw";

/**
 * @param {ChatInputCommandInteraction<CacheType>} interaction client interaction -> slash command
 * @author Flowtastisch
 * @memberof ScriptWerk
 * @date 19.05.2024
 */
export function hi (interaction: ChatInputCommandInteraction<CacheType>) {
    const   userName = interaction.user.displayName,
            replyMsg = I18nSW.getText("cmdHiReplyMsg", { values: [userName, "lol"] });
    

    interaction.reply(replyMsg);
}
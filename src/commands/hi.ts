import { CacheType, ChatInputCommandInteraction, Client } from "discord.js";
import { I18nSW } from "../lib/i18n.sw";

/**
 * @method handels the /hi command
 * @param {Client<boolean>} client the client property
 * @param {ChatInputCommandInteraction<CacheType>} interaction client interaction -> slash command
 * @author Flowtastisch
 * @memberof ScriptWerk
 * @date 19.05.2024
 */
export function hi (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>) {
    const   userName = interaction.user.displayName,
            replyMsg = I18nSW.getText("cmdHiReplyMsg", {
                lang: interaction.locale,
                values: [userName, "lol"]
            });
    

    interaction.reply(replyMsg);
}
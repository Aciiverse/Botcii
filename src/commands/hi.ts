import { CacheType, ChatInputCommandInteraction } from "discord.js";

/**
 * @param {ChatInputCommandInteraction<CacheType>} interaction client interaction -> slash command
 * @author Flowtastisch
 * @memberof ScriptWerk
 * @date 19.05.2024
 */
export function hi (interaction: ChatInputCommandInteraction<CacheType>) {
    interaction.reply("hi 🥑🙂");
}
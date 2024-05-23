import { CacheType, ChatInputCommandInteraction, Client, PermissionFlagsBits } from "discord.js";
import { db } from "../lib/db";
import { AutoChannelEntry } from "../actions/autoChannel";
import { I18nSW } from "../lib/i18n.sw";

/**
 * @method handels the /autochanneladd command
 * @param {Client<boolean>} client the client property
 * @param {ChatInputCommandInteraction<CacheType>} interaction client interaction -> slash command
 * @author Flowtastisch
 * @memberof ScriptWerk
 * @date 23.05.2024
 */
export function autochanneladd (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>) {
    const   guildId         = interaction.guildId,
            optionsData     = interaction.options.data,
            newChannelOpt   = optionsData.find(e => e.name === "joinchannel"),
            newCategoryOpt  = optionsData.find(e => e.name === "targetcategory"),
            newChannelId    = newChannelOpt?.value,
            newCategoryId   = newCategoryOpt?.value;
    
    // Validation:
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        // -> is not admin
        const errMsg = I18nSW.getText("errNoPerm", { lang: interaction.locale });
        console.error(errMsg)
        interaction.reply(errMsg);
        return;
    }

    if (newChannelOpt?.value === "") {
        // -> given message is invalid (empty) -> Error
        const errMsg = I18nSW.getText("errEmptyProperty", {
            lang:   interaction.locale,
            values: [newChannelOpt.name]
        });
        interaction.reply(errMsg);
        console.error(errMsg);
        return;
    }

    if (newCategoryOpt?.value === "") {
        // -> given message is invalid (empty) -> Error
        const errMsg = I18nSW.getText("errEmptyProperty", {
            lang:   interaction.locale,
            values: [newCategoryOpt.name]
        });
        interaction.reply(errMsg);
        console.error(errMsg);
        return;
    }

    db.query('SELECT channelId FROM autoChannel WHERE guildId = ? AND channelId = ? LIMIT 1;',
        [guildId, newChannelId],
        (err, result: AutoChannelEntry[]) => {
            if (err) {
                // -> Error occured
                const errMsg = I18nSW.getText("err", { lang: interaction.locale });
                interaction.reply(errMsg);
                console.error(err);
            } else if (result.length !== 0) {
                // -> Channel already used -> Error
                const errMsg = I18nSW.getText("errChannelAlreadyUsed", { lang: interaction.locale });
                interaction.reply(errMsg);
                console.error(errMsg);
            } else {
                // -> Channel not used before
                db.query('INSERT INTO autoChannel ( guildId, channelId, parentChannelGroupId ) VALUES ( ?, ?, ? );',
                    [guildId, newChannelId, newCategoryId],
                    (errCreate, resultCreate) => {
                        if (errCreate) {
                            // -> Error occured
                            const errMsg = I18nSW.getText("err", { lang: interaction.locale });
                            interaction.reply(errMsg);
                            console.error(errCreate);
                        } else {
                            // -> Success (Created)
                            interaction.reply(I18nSW.getText("sucAutoChannelAdded", { lang: interaction.locale }));
                        }
                    });
            }
        });
}
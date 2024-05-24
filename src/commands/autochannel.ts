import { APIActionRowComponent, APIMessageActionRowComponent, ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, ChatInputCommandInteraction, Client, CommandInteractionOption, JSONEncodable, PermissionFlagsBits } from "discord.js";
import { db } from "../lib/db";
import { AutoChannelEntry } from "../actions/autoChannel";
import { I18nSW } from "../lib/i18n.sw";

/**
 * @method handels the /autochannel command
 * @param {Client<boolean>} client the client property
 * @param {ChatInputCommandInteraction<CacheType>} interaction client interaction -> slash command
 * @author Flowtastisch
 * @memberof ScriptWerk
 * @date 23.05.2024
 */
export function autochannel (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType> | ButtonInteraction) {
    // Validation:
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        // -> is not admin
        const errMsg = I18nSW.getText("errNoPerm", { lang: interaction.locale });
        console.error(errMsg)
        interaction.reply(errMsg);
        return;
    }

    if (interaction.isChatInputCommand()) {
        // -> ChatInput interaction type

        const   optionsData = interaction.options.data,
                addSubCmd   = optionsData.find(e => e.name === "add"),
                listSubCmd  = optionsData.find(e => e.name === "list");

        if (addSubCmd) {
            // -> 'add' sub command
            autochannelAdd(interaction);
        } else if (listSubCmd) {
            // -> 'list' sub command
            autochannelList(interaction);
        } else {
            // -> Sub Cmd unknown
            const msg = I18nSW.getText("errUnknCmd", { lang: interaction.locale });
            interaction.reply(msg);
            console.error(msg);
        }

    } else if (interaction.isButton()) {
        // -> Button interaction type
        const   customId    = interaction.customId,
                splittedId  = customId.split("-");

        if (splittedId[1] === "remove") {
            // -> channel configuration remove action
            const channelId = splittedId[2];

            handleRemoveBtnClick(interaction, channelId)
        }

    }
    
}

/**
 * @method handels the /autochannel add command
 * @param {ChatInputCommandInteraction<CacheType>} interaction client interaction -> slash command
 * @author Flowtastisch
 * @memberof ScriptWerk
 * @date 23.05.2024
 */
function autochannelAdd (interaction: ChatInputCommandInteraction<CacheType>) {
    const   guildId         = interaction.guildId,
            optionsData     = interaction.options.data,
            addOptionsData  = optionsData?.find(e => e.name === "add") as CommandInteractionOption<CacheType> | undefined,
            newChannelOpt   = addOptionsData?.options?.find(e => e.name === "joinchannel"),
            newCategoryOpt  = addOptionsData?.options?.find(e => e.name === "targetcategory"),
            newChannelId    = newChannelOpt?.value,
            newCategoryId   = newCategoryOpt?.value;

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

/**
 * @method handels the /autochannel list command
 * @param {ChatInputCommandInteraction<CacheType>} interaction client interaction -> slash command
 * @author Flowtastisch
 * @memberof ScriptWerk
 * @date 23.05.2024
 */
function autochannelList (interaction: ChatInputCommandInteraction<CacheType>) {
    const guildId = interaction.guildId;

    db.query('SELECT channelId, parentChannelGroupId FROM autoChannel WHERE guildId = ?;',
        [guildId],
        (err, result: AutoChannelEntry[]) => {
            if (err) {
                // -> Error occured
                const errMsg = I18nSW.getText("err", { lang: interaction.locale });
                interaction.reply(errMsg);
                console.error(err);
            } else if (result.length === 0) {
                // -> Error occured
                interaction.reply(I18nSW.getText("infoNoAutoChannelEntries", { lang: interaction.locale }));
            } else {
                // -> Success
                const   channel     = interaction.channel,
                        channels    = interaction.guild?.channels;
               
                // Fist message:
                interaction?.reply(I18nSW.getText("cmdAutoChannelList", {
                    lang: interaction.locale,
                    values: [String(result.length)]
                }));

                result.forEach(async e => {
                    const   btn = createRemoveBtn(interaction, `autochannel-remove-${e.channelId}`),
                            row = new ActionRowBuilder().addComponents(btn) as ActionRowBuilder<ButtonBuilder>;

                    // Each entries
                    try {
                        const   unknownTxt      = I18nSW.getText("unknown", { lang: interaction.locale });

                        let eChannelName = unknownTxt, eCategoryName = unknownTxt;

                        if (channels?.cache.get(e.channelId)) {
                            const eChannel = await channels?.fetch(e.channelId);

                            eChannelName = eChannel?.name!;
                        }
                        if (channels?.cache.get(e.parentChannelGroupId)) {
                            const eCategory = await channels?.fetch(e.parentChannelGroupId);

                            eCategoryName = eCategory?.name!;
                        }

                        channel?.send({
                            content: I18nSW.getText("cmdAutoChannelEntyTxt", {
                                lang: interaction.locale,
                                values: [eChannelName, eCategoryName]
                            }),
                            components: [row]
                        });

                    } catch (error) {
                        console.error(error);
                    }
                });
                
            }
        });
}

function createRemoveBtn (interaction: ChatInputCommandInteraction<CacheType>, customId: string) {
    const btn = new ButtonBuilder()
        .setEmoji('🗑️')
        .setLabel(I18nSW.getText("cmdAutoChannelRemove", { lang: interaction.locale }))
        .setCustomId(customId)
        .setStyle(ButtonStyle.Danger);

    return btn;
}

function handleRemoveBtnClick (interaction: ButtonInteraction, channelId: string) {
    const   guildId = interaction.guildId;

    db.query('DELETE FROM autoChannel WHERE guildId = ? AND channelId = ?;',
        [guildId, channelId],
        (err, result: AutoChannelEntry[]) => {
            if (err) {
                // -> Error occured
                const errMsg = I18nSW.getText("err", { lang: interaction.locale });
                interaction.reply(errMsg);
                console.error(err);
            } else {
                // -> Success
                interaction.reply(I18nSW.getText("sucAutoChannelRemoved", { lang: interaction.locale }));
                interaction.message.delete();
            }
    });
}
import { APIActionRowComponent, APIMessageActionRowComponent, ActionRowBuilder, BaseGuildTextChannel, CacheType, ChannelSelectMenuBuilder, ChannelSelectMenuInteraction, ChannelType, Client, JSONEncodable, MessageContextMenuCommandInteraction, PermissionFlagsBits } from "discord.js";
import { I18nSW } from "../lib/i18n.sw";

/**
 * @method handles the /copyMessage command
 * @param {Client<boolean>} client the client property
 * @param {MessageContextMenuCommandInteraction<CacheType>} interaction client interaction -> slash command
 * @author Flowtastisch
 * @memberof ScriptWerk
 * @date 19.05.2024
 */
export function copyMessage (client: Client<boolean>, interaction: MessageContextMenuCommandInteraction<CacheType>) {
    const channel = client.channels.cache.get(interaction.channelId) as BaseGuildTextChannel | undefined;

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        // -> is not admin
        const errMsg = I18nSW.getText("errNoPerm", { lang: interaction.locale });
        console.error(errMsg)
        interaction.reply(errMsg);
        return;
    }

    if (channel?.guildId !== interaction.guildId) {
        // -> Channel is from another server
        const errMsg = I18nSW.getText("errInvalidChannel", { lang: interaction.locale });

        interaction.reply(errMsg);
        console.error(errMsg);
        return;
    }

    const   channelSelect = createChannelSelect(interaction, `copyMessage-channelSelect-${interaction.targetId}`),
            row = new ActionRowBuilder().addComponents(channelSelect) as JSONEncodable<APIActionRowComponent<APIMessageActionRowComponent>>;

    try {
        interaction.reply({
            content: I18nSW.getText("cmdCopyMessageSelectPlaceholder", { lang: interaction.locale }),
            components: [row]
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * @method creates & returns a new channel select
 * @param {MessageContextMenuCommandInteraction<CacheType> | ChannelSelectMenuInteraction<CacheType>} interaction the interaction
 * @param {string} customID the channel select custom id
 * @author Flowtastisch
 * @memberof ScriptWerk
 * @date 20.05.2024
 */
function createChannelSelect (interaction: MessageContextMenuCommandInteraction<CacheType> | ChannelSelectMenuInteraction<CacheType>, customID: string) {
    const select = new ChannelSelectMenuBuilder({channel_types: [ChannelType.GuildVoice, ChannelType.GuildAnnouncement, ChannelType.GuildText]})
        .setPlaceholder(I18nSW.getText("cmdCopyMessageSelectPlaceholder", { lang: interaction.locale }))
        .setCustomId(customID)
        .setMaxValues(1);

    return select;
}

/**
 * @async
 * @method handles the channel select
 * @param {Client<boolean>} client the client
 * @param {ChannelSelectMenuInteraction<CacheType>} interaction the interaction
 * @author Flowtastisch
 * @memberof ScriptWerk
 * @date 20.05.2024
 */
export async function channelSelect (client: Client<boolean>, interaction: ChannelSelectMenuInteraction<CacheType>) {
    const   templateMsgID   = interaction.customId.split("-")[2],
            targetChannel   = client.channels.cache.get(interaction.values[0]) as BaseGuildTextChannel | undefined,
            templateMsg     = await interaction.channel!.messages.fetch(templateMsgID),
            updatedMsg      = await interaction.channel?.messages.fetch(interaction.message.id),
            updatedSelect   = createChannelSelect(interaction, interaction.customId)
                .setDisabled(true)
                .setDefaultChannels([targetChannel?.id!]),
            updatedRow      = new ActionRowBuilder().addComponents(updatedSelect) as JSONEncodable<APIActionRowComponent<APIMessageActionRowComponent>>;

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        // -> is not admin
        const errMsg = I18nSW.getText("errNoPerm", { lang: interaction.locale });
        console.error(errMsg)
        interaction.reply(errMsg);
        return;
    }

    if (targetChannel?.guildId !== interaction.guildId) {
        // -> Channel is from another server
        const errMsg = I18nSW.getText("errInvalidChannel", { lang: interaction.locale });

        interaction.reply(errMsg);
        console.error(errMsg);
        return;
    }
    targetChannel.send(templateMsg.content);

    try {
        updatedMsg?.edit({
            content: I18nSW.getText("cmdCopyMessageSelected", { lang: interaction.locale }),
            components: [updatedRow]
        });
        
        interaction.reply(I18nSW.getText("sucMessageSended", { lang: interaction.locale }));
    } catch (error) {
        console.error(error);
    }
    
}
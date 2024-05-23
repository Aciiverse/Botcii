import { ChannelType, VoiceState } from "discord.js";
import { db } from "../lib/db";
import { ResultSetHeader } from "mysql2";

interface AutoChannelEntry extends ResultSetHeader {
    guildId:                string,
    channelId:              string,
    parentChannelGroupId:   string
}

/**
 * @method handles the user joins a new channel
 * @param {VoiceState} voiceState
 * @author Flowtastisch
 * @memberof ScriptWerk
 * @date 23.05.2024
 */
export function onUserJoinsChannel (voiceState: VoiceState) {
    const   guild               = voiceState.guild,
            guildId             = guild.id,
            templateChannel     = voiceState.channel!,
            templateChannelId   = templateChannel.id;

    db.query('SELECT parentChannelGroupId FROM autoChannel WHERE guildId = ? AND channelId = ? LIMIT 1;',
        [guildId, templateChannelId],
        async (err, result: AutoChannelEntry[]) => {
            if (err) {
                // -> Error occured
                console.error(err);
            } else if (result.length >= 1) {
                // -> Channel is autoChannel in guild
                const   parentChannelId = result[0].parentChannelGroupId,
                        parentChannel   = await guild.channels.fetch(parentChannelId);

                if (!parentChannel || parentChannel === null) {
                    // -> Parent channel missing
                    console.error('parent channel is missing!');
                    return;
                }
                try {

                    const   member      = voiceState.member,
                            newChannel  = await guild.channels.create({
                                name:       `${templateChannel.name} (${member?.displayName})`,
                                type:       ChannelType.GuildVoice,
                                parent:     parentChannelId,
                                userLimit:  templateChannel.userLimit
                            });
            
                    member?.voice.setChannel(newChannel);

                } catch (error) {
                    console.error(error);
                }
            }
        });
}

/**
 * @method handles the user leaves a channel event
 * @param {VoiceState} voiceState
 * @author Flowtastisch
 * @memberof ScriptWerk
 * @date 23.05.2024
 */
export function onUserLeavesChannel (voiceState: VoiceState) {
    const   guild   = voiceState.guild,
            guildId = guild.id,
            channel = voiceState.channel,
            groupId = channel?.parentId,
            members = Array.from(channel?.members.values()!);

    if (members.length === 0) {
        // -> channel is empty

        db.query('SELECT parentChannelGroupId FROM autoChannel WHERE guildId = ? AND parentChannelGroupId = ? LIMIT 1;',
            [guildId, groupId],
            (err, result: AutoChannelEntry[]) => {
                if (err) {
                    // -> Error occured
                    console.error(err);
                } else if (result.length >= 1) {
                    // -> channel is in auto channel group
                    channel?.delete();
                }
            });

    }
    
}
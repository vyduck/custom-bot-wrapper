import { Guild, TextChannel } from "discord.js";

/**
 * 
 * @param { Guild } guild 
 * @param { TextChannel | undefined } channel 
 * @returns 
 */
export async function getPerms(guild, channel) {
    if (!guild.available) await guild.fetch();
    const botMember = await guild.members.fetchMe();

    if (channel == undefined) return botMember.permissions;

    return botMember.permissionsIn(channel);
}
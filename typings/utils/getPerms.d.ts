/**
 *
 * @param { Guild } guild
 * @param { TextChannel | undefined } channel
 * @returns
 */
export function getPerms(guild: Guild, channel: TextChannel | undefined): Promise<Readonly<import("discord.js").PermissionsBitField>>;
import { Guild } from "discord.js";
import { TextChannel } from "discord.js";

export class CommandHandler {
    /**
     * Constructor of command
     * @param {App} app The app this command belongs to
     * @param {Object} options Options for constructing command
     * @param {string} options.name Name of the command
     * @param {Function} options.exec execution function of the command handler
     * @param {PermissionsBitField} options.perms permissions required for executing the command handler
     * @param {SlashCommandBuilder} options.builder Discord constructor of the command
     */
    constructor({ name, perms, exec, builder }: App);
    /** @type {App} */
    app: App;
    /** @type {string} */
    name: string;
    /** @type {SlashCommandBuilder} */
    builder: SlashCommandBuilder;
    /** @type {Function} */
    exec: Function;
    /** @type {PermissionsBitField} */
    perms: PermissionsBitField;
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @returns {}
     */
    execute(interaction: ChatInputCommandInteraction): any;
}
import { App } from "./app.js";
import { SlashCommandBuilder } from "discord.js";
import { PermissionsBitField } from "discord.js";
import { ChatInputCommandInteraction } from "discord.js";

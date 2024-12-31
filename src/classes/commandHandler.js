import { ChatInputCommandInteraction, Message, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { App } from "./app.js";

export class CommandHandler {
    /** @type {App} */
    app;

    /** @type {string} */
    name;

    /** @type {SlashCommandBuilder} */
    builder;

    /** @type {Function} */
    exec;

    /** @type {PermissionsBitField} */
    perms;

    /**
     * Constructor of command
     * @param {Object} options Options for constructing command
     * @param {string} options.name Name of the command
     * @param {Function} options.exec execution function of the command handler
     * @param {PermissionsBitField} options.perms permissions required for executing the command handler
     * @param {SlashCommandBuilder} options.builder Discord constructor of the command
     */
    constructor({
        name,
        perms = new PermissionsBitField(),
        exec,
        builder
    }) {

        this.name = name;
        this.perms = perms;
        this.exec = exec;
        this.builder = builder;
    };

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @returns {}
     */
    async execute(interaction) {
        // Permission check
        const botPerms = interaction.guild.members.me.permissionsIn(interaction.channel);
        const missing = botPerms.missing(this.perms.bitfield);
        if (missing.length != 0) return {
            success: false,
            resposne: "Insufficient permissions",
            info: missing
        };

        // Execute the command
        try {
            const response = await this.exec.bind(this.app)(interaction);
            return {
                success: true,
                response,
            };
        } catch (error) {
            this.app.log.error(error);
            return {
                success: false,
                response: error.toString(),
                info: error
            };
        }
    };
};
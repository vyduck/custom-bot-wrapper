import * as discord from "discord.js";
import CommandHandler from "./commandHandler";
import EventHandler from "./eventHandler";
import logger from "./logger";
import { Logger } from "winston";
import mongoose from "mongoose";

class App {
    /** @type {Object} */
    config;

    /** @type {discord.Client} */
    client;

    /** @type {discord.Collection<string, CommandHandler>} */
    commands;

    /** @type {discord.Collection<string, EventHandler>} */
    events;

    /** @type {Logger} */
    log;

    /** @type {Object} */
    db = {};

    /**
     * constructor for the App
     * @param {Object} config               - options for constructing the app
     * @param {number} config.intents       - the intents with which the discord client will login
     * @param {string} config.token         - the token to the bot
     * @param {bigint} config.clientId      - application id of the bot
     * @param {string} config.dbURL         - the url used to connect to mongodb
     * @param {string} tag                  - a three letter tag for the logger
     */
    constructor({
        intents = 0n,
        clientId,
        token,
        dbURL = ""
    }, tag = "") {
        this.client = new discord.Client({
            intents
        });

        this.config = {
            intents, clientId, token, dbURL
        };

        this.commands = new discord.Collection();

        this.events = new discord.Collection();

        this.log = logger(tag);

    };

    /**
     * @private
     * @param {CommandHandler} commandHandler command to be added
     */
    addCommandHandler(commandHandler) {
        this.commands.set(commandHandler.name, commandHandler);
    }

    /**
     * @private
     * @param {EventHandler} eventHandler command to be added
     */
    addEventHandler(eventHandler) {
        this.events.set(eventHandler.name, eventHandler);
    }


    async publishCommands() {
        let commandData = [];
        this.commands.values().forEach(commandHandler => {
            commandData.push(commandHandler.builder.toJSON())
        });

        const rest = new discord.REST().setToken(this.config.token);

        try {
            const data = await rest.put(
                discord.Routes.applicationCommands(this.config.clientId),
                { body: commandData }
            );

            this.log.info(`Successfully updated ${data.length} comamnds.`);
        } catch (error) {
            this.log.error("Error while uploading commands.", error);
        };
    }

    loadCommandHandlers() {
        this.client.on("interactionCreate", async (interaction) => {
            if (!(interaction instanceof discord.ChatInputCommandInteraction)) return;

            const response = await this.commands.get(interaction.command).execute(interaction);

            if (response.success) return;

            try {
                interaction.reply({
                    ephemeral: true,
                    content:
                        `The execution of the command failed because of the following reason: \`${response.response}\`\n` +
                        "```\n" + JSON.stringify(response.info, Object.getOwnPropertyNames(response.info))
                });
            } catch (error) {
                this.log.error(`Error while executing the command: ${interaction.command}.`, error);
            }
        })
    }

    loadEventHandlers() {
        this.events.values().forEach(eventHandler => {
            this.client[eventHandler.once ? "once" : "on"](eventHandler.name, async (...args) => {
                const response = await eventHandler.execute(...args);

                if (response.success) return;

                this.log.error(`Error whie executing the event handler: ${eventHandler.name}`, response);
            })
        });

    }

    addSchema(name, schema) {
        this.db[name] = schema;
    }

    async connectToMongoDB() {
        await mongoose.connect(this.config.dbURL);
    }

    /**
     * 
     * @param {Object} options
     * @param {string} options.token    - token of the discord client
     */
    async start() {
        await this.publishCommands();
        this.loadCommandHandlers();
        this.loadEventHandlers();
        if (this.config.dbURL) await this.connectToMongoDB();

        await this.client.login(this.config.token);
    }
}

export default App;
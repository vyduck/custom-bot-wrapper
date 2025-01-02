import * as discord from "discord.js";
import { CommandHandler } from "./commandHandler.js";
import { EventHandler } from "./eventHandler.js";
import { logger } from "./logger.js";
import { Logger } from "winston";
import mongoose from "mongoose";
import { ObjectStore } from "../stores/objectStore.js";

export class App {
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
        intents = 0,
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
     * @param {CommandHandler} commandHandler command to be added
     */
    addCommandHandler(commandHandler) {
        this.commands.set(commandHandler.name, commandHandler);
        commandHandler.app = this;
    }

    /**
     * @param {EventHandler} eventHandler command to be added
     */
    addEventHandler(eventHandler) {
        this.events.set(eventHandler.name, eventHandler);
        eventHandler.app = this;
    }

    /**
     * @param {ObjectStore} store store to be added
     */
    addStore(store) {
        this.db[store.name] = store;
    }

    /**
     * @private 
     */
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

            this.log.debug(`Successfully (re)published ${data.length} commands.`);
        } catch (error) {
            this.log.error("Error while uploading commands.", error);
        };    
    }    
    
    /**
     * @private 
     */
    loadCommandHandlers() {
        this.client.on("interactionCreate", async (interaction) => {
            if (!(interaction instanceof discord.ChatInputCommandInteraction)) return;

            await interaction.deferReply();

            const response = await this.commands.get(interaction.commandName).execute(interaction);

            if (response.success) return;

            try {
                interaction.editReply(
                    `The execution of the command failed because of the following reason: \`${response.response}\`\n` +
                    "```\n" + JSON.stringify(response.info, Object.getOwnPropertyNames(response.info)) + "```"
                );    
            } catch (error) {
                this.log.error(`Error while executing the command: ${interaction.command}.`, error);
            }    
        });    
        this.log.debug("Loaded command handlers.")
    }    

    /**
     * @private 
     */
    loadEventHandlers() {
        this.events.values().forEach(eventHandler => {
            this.client[eventHandler.once ? "once" : "on"](eventHandler.name, async (...args) => {
                const response = await eventHandler.execute(...args);

                if (response.success) return;
                
                this.log.error(`Error whie executing the event handler: ${eventHandler.name}`, response);
            })        
        });        
        this.log.debug("Loaded event handlers.")
    }        
    
    /**
     * @private
     */
    async connectToMongoDB() {
        await mongoose.connect(this.config.dbURL);
        this.log.debug("Connected to MongoDB.")
    }

    /**
     * Starts the bot
     */
    async start() {
        await this.publishCommands();
        this.loadCommandHandlers();
        this.loadEventHandlers();
        if (this.config.dbURL) await this.connectToMongoDB();

        await this.client.login(this.config.token);
    }
}
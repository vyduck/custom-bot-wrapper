export class App {
    /**
     * constructor for the App
     * @param {Object} config               - options for constructing the app
     * @param {number} config.intents       - the intents with which the discord client will login
     * @param {string} config.token         - the token to the bot
     * @param {bigint} config.clientId      - application id of the bot
     * @param {string} config.dbURL         - the url used to connect to mongodb
     * @param {string} tag                  - a three letter tag for the logger
     */
    constructor({ intents, clientId, token, dbURL }: {
        intents: number;
        token: string;
        clientId: bigint;
        dbURL: string;
    }, tag?: string);
    /** @type {Object} */
    config: any;
    /** @type {discord.Client} */
    client: discord.Client;
    /** @type {discord.Collection<string, CommandHandler>} */
    commands: discord.Collection<string, CommandHandler>;
    /** @type {discord.Collection<string, EventHandler>} */
    events: discord.Collection<string, EventHandler>;
    /** @type {Logger} */
    log: Logger;
    /** @type {Object} */
    db: any;
    /**
     * @private
     * @param {CommandHandler} commandHandler command to be added
     */
    private addCommandHandler;
    /**
     * @private
     * @param {EventHandler} eventHandler command to be added
     */
    private addEventHandler;
    publishCommands(): Promise<void>;
    loadCommandHandlers(): void;
    loadEventHandlers(): void;
    addSchema(name: any, schema: any): void;
    connectToMongoDB(): Promise<void>;
    /**
     *
     * @param {Object} options
     * @param {string} options.token    - token of the discord client
     */
    start(): Promise<void>;
}
import * as discord from "discord.js";
import { CommandHandler } from "./commandHandler.js";
import { EventHandler } from "./eventHandler.js";
import { Logger } from "winston";

import { App } from "./app.js";
import { PermissionsBitField } from "discord.js";

export class EventHandler {
    /** @type {App} */
    app;

    /** @type {string} */
    name;

    /** @type {Boolean} */
    once;

    /** @type {Function} */
    exec;

    /** @type {PermissionsBitField} */
    perms;

    /**
     * 
     * @param {App} app app to which this event handler should be registered
     * @param {Object} options options for the event handler
     * @param {string} options.name name of the event
     * @param {Function} options.exec execution function of the event handler
     * @param {PermissionsBitField} options.perms permissions required for executing the event handler
     * @param {Boolean} options.once whether this event should be executed only once
     */
    constructor(app, {
        name,
        perms = [],
        once,
        exec,
    }) {
        this.app = app;

        this.name = name;
        this.perms = perms;
        this.exec = exec;
        this.once = once;

        this.app.addEventHandler(this);
    }

    /**
     * 
     * @param  {...any} args arguments passed by discordjs event handler.
     * 
     * Permission check has to done in the event executer function.
     */
    async execute(...args) {
        if (this.perms.toArray().length != 0) args = [this.perms, ...args];

        try {
            const response = await this.exec.bind(this.app)(...args);
            return {
                success: true,
                response
            }
        } catch (error) {
            this.app.log.error(error);
            return {
                success: false,
                response: error
            }
        }
    }
};
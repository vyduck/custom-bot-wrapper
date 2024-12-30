export class EventHandler {
    /**
     *
     * @param {App} app app to which this event handler should be registered
     * @param {Object} options options for the event handler
     * @param {string} options.name name of the event
     * @param {Function} options.exec execution function of the event handler
     * @param {PermissionsBitField} options.perms permissions required for executing the event handler
     * @param {Boolean} options.once whether this event should be executed only once
     */
    constructor(app: App, { name, perms, once, exec, }: {
        name: string;
        exec: Function;
        perms: PermissionsBitField;
        once: boolean;
    });
    /** @type {App} */
    app: App;
    /** @type {string} */
    name: string;
    /** @type {Boolean} */
    once: boolean;
    /** @type {Function} */
    exec: Function;
    /** @type {PermissionsBitField} */
    perms: PermissionsBitField;
    /**
     *
     * @param  {...any} args arguments passed by discordjs event handler.
     *
     * Permission check has to done in the event executer function.
     */
    execute(...args: any[]): Promise<{
        success: boolean;
        response: any;
    }>;
}
import { App } from "./app.js";
import { PermissionsBitField } from "discord.js";

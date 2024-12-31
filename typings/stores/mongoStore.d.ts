export class MongoStore extends ObjectStore {
    /**
     * Constructor of mongo store
     * @param {Object} options options for constructing mongo store
     * @param {string} options.name name of the store
     * @param {Function} options.template a function to generate the outline of an object
     * @param {Model} options.model mongoose model corresponding to the store
     */
    constructor({ name, template, model }: {
        name: string;
        template: Function;
        model: Model<any, any, any, any, any, any>;
    });
    /** @type {Model} */
    store: Model<any, any, any, any, any, any>;
    /**
     *
     * @param {string | number} objectId ID of the object to fetch from mongodb
     * @returns Object corresponding to provided ID or an outline based on provided template
     */
    get(objectId: string | number): Promise<any>;
    /**
     *
     * @param {string | number} objectId ID of the object to be modified
     * @param {*} object
     * @returns
     */
    set(objectId: string | number, object: any): Promise<void>;
}
import { ObjectStore } from "./objectStore.js";
import { Model } from "mongoose";

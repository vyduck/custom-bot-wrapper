export class MongoStore extends ObjectStore {
    /**
     * Constructor of mongo store
     * @param {Object} options options for constructing mongo store
     */
    constructor(options: any);
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

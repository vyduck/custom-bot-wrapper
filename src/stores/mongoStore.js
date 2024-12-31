import { Model } from "mongoose";
import { ObjectStore } from "./objectStore.js";

export class MongoStore extends ObjectStore {
    /** @type {string} */
    name;

    /** @type {Model} */
    store;

    /** @type {Function} */
    template;

    /**
     * Constructor of mongo store
     * @param {Object} options options for constructing mongo store
     */
    constructor(options) {
        super(options)
    };

    /**
     * 
     * @param {string | number} objectId ID of the object to fetch from mongodb
     * @returns Object corresponding to provided ID or an outline based on provided template
     */
    async get(objectId) {
        let reqObj = await this.store.findOne({
            id: objectId
        });

        return reqObj ?? this.template(objectId);
    };

    /**
     * 
     * @param {string | number} objectId ID of the object to be modified
     * @param {*} object 
     * @returns 
     */
    async set(objectId, object) {
        const response = await this.store.findOneAndUpdate({
            id: objectId
        }, object);

        if (!response) await this.store.create(object);
    };
}
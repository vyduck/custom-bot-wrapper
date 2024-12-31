export class ObjectStore {
    /** @type {string} */
    name;

    /** @type {Map} */
    store;

    /** @type {Function} */
    template;

    /**
     * Constructor of custom store
     * @constructor
     * @param {Object} options options for constructing object store
     * @param {string} options.name name of the store
     * @param {Function} options.template a function to generate the outline of an object
     */
    constructor({
        name, template
    }) {
        this.name = name;
        this.template = template;
        this.store = new Map();
    };

    /**
     * 
     * @param {string | number} objectId ID of the object to be returned
     * @returns { Object } returns the object with corresponding id or an outline
     */
    get(objectId) {
        return this.store.get(objectId) ?? this.template(objectId);
    };

    /**
     * 
     * @param {string | number} objectId if of the object to be stored
     * @param {Object} object object to be stored
     * @returns map of all objects stored
     */
    set(objectId, object) {
        return this.store.set(objectId, object);
    };
}
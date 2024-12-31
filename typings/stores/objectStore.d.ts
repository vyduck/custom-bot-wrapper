export class ObjectStore {
    /**
     * Constructor of custom store
     * @constructor
     * @param {Object} options options for constructing object store
     * @param {string} options.name name of the store
     * @param {Function} options.template a function to generate the outline of an object
     */
    constructor({ name, template }: {
        name: string;
        template: Function;
    });
    /** @type {string} */
    name: string;
    /** @type {Map} */
    store: Map<any, any>;
    /** @type {Function} */
    template: Function;
    /**
     *
     * @param {string | number} objectId ID of the object to be returned
     * @returns { Object } returns the object with corresponding id or an outline
     */
    get(objectId: string | number): any;
    /**
     *
     * @param {string | number} objectId if of the object to be stored
     * @param {Object} object object to be stored
     * @returns map of all objects stored
     */
    set(objectId: string | number, object: any): Map<any, any>;
}

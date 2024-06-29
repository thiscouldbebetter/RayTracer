"use strict";
class Lighting {
    constructor(lights) {
        this.lights = lights;
    }
    // Serializable.
    fromJson(objectAsJson) {
        throw new Error("To be implemented!");
    }
    toJson() {
        throw new Error("To be implemented!");
    }
    prototypesSet() {
        this.lights.forEach(x => {
            var prototypeToSet = x.typeName == LightAmbient.name
                ? LightAmbient.prototype
                : x.typeName == LightDirectional.name
                    ? LightDirectional.prototype
                    : x.typeName == LightPoint.name
                        ? LightPoint.prototype
                        : null;
            if (prototypeToSet == null) {
                throw new Error("Unrecognized Light type.");
            }
            Object.setPrototypeOf(x, prototypeToSet);
        }); // hack
        return this;
    }
}

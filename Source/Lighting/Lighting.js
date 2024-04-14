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
        this.lights.forEach(x => Object.setPrototypeOf(x, LightPoint.prototype)); // hack
        return this;
    }
}
Lighting.Temp = Coords.create();
Lighting.Temp2 = Coords.create();
Lighting.Temp3 = Coords.create();

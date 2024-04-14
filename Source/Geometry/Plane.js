"use strict";
class Plane {
    constructor(positionsOnPlane) {
        this.positionsOnPlane = positionsOnPlane;
        this.normal = new Coords(0, 0, 0);
        this.recalculateDerivedValues();
    }
    recalculateDerivedValues() {
        var pos0 = this.positionsOnPlane[0];
        var displacementFromPos0To1 = this.positionsOnPlane[1].clone().subtract(pos0);
        var displacementFromPos0To2 = this.positionsOnPlane[2].clone().subtract(pos0);
        this.normal.overwriteWith(displacementFromPos0To1).crossProduct(displacementFromPos0To2).normalize();
        this.distanceFromOrigin = this.normal.dotProduct(pos0);
    }
    // Serializable.
    fromJson(objectAsJson) {
        throw new Error("To be implemented!");
    }
    toJson() {
        throw new Error("To be implemented!");
    }
    prototypesSet() {
        var typeSetOnObject = SerializableHelper.typeSetOnObject;
        typeSetOnObject(Coords, this.normal);
        this.positionsOnPlane.forEach(x => typeSetOnObject(Coords, x));
        return this;
    }
}

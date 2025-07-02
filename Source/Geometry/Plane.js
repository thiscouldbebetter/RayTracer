"use strict";
class Plane {
    constructor(name, positionsOnPlane) {
        this.name = name;
        this.positionsOnPlane = positionsOnPlane;
        this.normal = Coords.create();
        this.recalculateDerivedValues();
        this.typeName = Plane.name;
    }
    recalculateDerivedValues() {
        var pos0 = this.positionsOnPlane[0];
        var displacementFromPos0To1 = this.positionsOnPlane[1].clone().subtract(pos0);
        var displacementFromPos0To2 = this.positionsOnPlane[2].clone().subtract(pos0);
        this.normal.overwriteWith(displacementFromPos0To1).crossProduct(displacementFromPos0To2).normalize();
        this.distanceFromOrigin = this.normal.dotProduct(pos0);
    }
    // Shape.
    addCollisionsWithRayToGroup(ray, groupToAddTo) {
        throw new Error("To be implemented!");
    }
    clone() {
        return new Plane(this.name, this.positionsOnPlane.map(x => x.clone()));
    }
    surfaceMaterialColorAndNormalForCollision(scene, collision) {
        throw new Error("To be implemented!");
    }
    transformApply(transform) {
        throw new Error("To be implemented!");
    }
    // Serializable.
    fromJson(objectAsJson) {
        throw new Error("To be implemented!");
    }
    prototypesSet() {
        var typeSetOnObject = SerializableHelper.typeSetOnObject;
        typeSetOnObject(Coords, this.normal);
        this.positionsOnPlane.forEach(x => typeSetOnObject(Coords, x));
        return this;
    }
    toJson() {
        throw new Error("To be implemented!");
    }
    toObjectSerializable() {
        return this;
    }
}

"use strict";
class Sphere {
    constructor(name, materialName, radius, centerPos, orientation) {
        this.typeName = Sphere.name;
        this.name = name;
        this.materialName = materialName;
        this.radius = radius;
        this.centerPos = centerPos;
        this.orientation = orientation;
    }
    // Shape.
    addCollisionsWithRayToList(ray, listToAddTo) {
        var collision = new Collision().rayAndSphere(ray, this);
        if (collision.colliderByName(Sphere.name) != null) {
            collision.colliderByNameSet(ShapeHelper.name, this);
            listToAddTo.push(collision);
        }
        return listToAddTo;
    }
    material(scene) {
        return scene.materialByName(this.materialName);
    }
    surfaceMaterialColorAndNormalForCollision(scene, collisionClosest, surfaceMaterial, surfaceColor, surfaceNormal) {
        var sphere = collisionClosest.colliderByName(Sphere.name);
        var surfacePos = collisionClosest.pos;
        var sphereMaterial = sphere.material(scene);
        surfaceMaterial.overwriteWith(sphereMaterial);
        surfaceNormal.overwriteWith(surfacePos).subtract(sphere.centerPos).normalize();
        var surfaceNormalInLocalCoords = new TransformOrient(this.orientation).transformCoords(surfaceNormal.clone());
        var surfaceNormalInLocalCoordsAsPolar = Polar.create().fromCoords(surfaceNormalInLocalCoords);
        var texelUv = this.texelUv();
        texelUv.overwriteWithXYZ(surfaceNormalInLocalCoordsAsPolar.azimuth, (1 + surfaceNormalInLocalCoordsAsPolar.elevation) / 2, 0); // todo
        surfaceMaterial.colorSetFromUv(surfaceColor, texelUv);
        return surfaceColor;
    }
    // Clonable.
    clone() {
        return new Sphere(this.name, this.materialName, this.radius, this.centerPos.clone(), this.orientation.clone());
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
        typeSetOnObject(Coords, this.centerPos);
        typeSetOnObject(Orientation, this.orientation);
        typeSetOnObject(Coords, this._texelUv);
        return this;
    }
    // Temporary variables.
    texelUv() {
        if (this._texelUv == null) {
            this._texelUv = Coords.create();
        }
        return this._texelUv;
    }
}

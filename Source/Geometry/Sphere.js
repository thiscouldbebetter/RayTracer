"use strict";
class Sphere {
    constructor(name, materialName, radius, disp) {
        this.typeName = Sphere.name;
        this.name = name;
        this.materialName = materialName;
        this.radius = radius;
        this.disp = disp;
        this._polar = Polar.create();
        this._transformOrient =
            TransformOrient.create();
    }
    // Shape.
    addCollisionsWithRayToList(ray, listToAddTo) {
        var collision = new Collision().rayAndSphere(ray, this);
        if (collision.shapeCollidingWithName(Sphere.name) != null) {
            collision.shapeCollidingAdd(this);
            listToAddTo.push(collision);
        }
        return listToAddTo;
    }
    material(scene) {
        return scene.materialByName(this.materialName);
    }
    surfaceMaterialColorAndNormalForCollision(scene, collision) {
        var sphere = collision.shapeCollidingWithName(Sphere.name);
        var surfacePos = collision.pos;
        var sphereMaterial = sphere.material(scene);
        var surfaceMaterial = collision.surfaceMaterial.overwriteWith(sphereMaterial);
        var surfaceColor = collision.surfaceColor;
        var surfaceNormal = collision.surfaceNormal
            .overwriteWith(surfacePos)
            .subtract(sphere.disp.pos)
            .normalize();
        var surfaceNormalInLocalCoords = this._transformOrient
            .orientationSet(this.disp.ori)
            .transformCoords(surfaceNormal.clone());
        var surfaceNormalInLocalCoordsAsPolar = this._polar
            .fromCoords(surfaceNormalInLocalCoords);
        var texelUv = this.texelUv();
        texelUv.overwriteWithXYZ(surfaceNormalInLocalCoordsAsPolar.azimuth, (1 + surfaceNormalInLocalCoordsAsPolar.elevation) / 2, 0); // todo
        surfaceMaterial.colorSetFromUv(surfaceColor, texelUv);
        return surfaceColor;
    }
    transformApply(transform) {
        transform.transformCoords(this.disp.pos);
        return this;
    }
    // Clonable.
    clone() {
        return new Sphere(this.name, this.materialName, this.radius, this.disp.clone());
    }
    // Serializable.
    fromJson(objectAsJson) {
        throw new Error("To be implemented!");
    }
    prototypesSet() {
        var typeSetOnObject = SerializableHelper.typeSetOnObject;
        typeSetOnObject(Disposition, this.disp);
        this.disp.prototypesSet();
        typeSetOnObject(Coords, this._texelUv);
        return this;
    }
    toJson() {
        throw new Error("To be implemented!");
    }
    toObjectSerializable() {
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

"use strict";
class Sphere {
    constructor(name, materialName, radius, centerPos, orientation) {
        this.typeName = Sphere.name;
        this.name = name;
        this.materialName = materialName;
        this.radius = radius;
        this.centerPos = centerPos;
        this.orientation = orientation;
        this._texelUv = Coords.create();
    }
    // collidable
    addCollisionsWithRayToList(ray, listToAddTo) {
        var collision = new Collision().rayAndSphere(ray, this);
        if (collision.colliderByName(Sphere.name) != null) {
            collision.colliderByNameSet("Collidable", this);
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
        surfaceMaterial.overwriteWith(sphere.material(scene));
        surfaceNormal.overwriteWith(surfacePos).subtract(sphere.centerPos).normalize();
        if (surfaceMaterial.texture == null) {
            surfaceColor.overwriteWith(surfaceMaterial.color);
        }
        else {
            var surfaceNormalInLocalCoords = new TransformOrient(this.orientation).transformCoords(surfaceNormal.clone());
            var surfaceNormalInLocalCoordsAsPolar = Polar.create().fromCoords(surfaceNormalInLocalCoords);
            var _texelUv = this._texelUv;
            _texelUv.overwriteWithXYZ(surfaceNormalInLocalCoordsAsPolar.azimuth, (1 + surfaceNormalInLocalCoordsAsPolar.elevation) / 2, 0); // todo
            surfaceMaterial.texture.colorSetFromUV(surfaceColor, _texelUv);
        }
        return surfaceColor;
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
}

"use strict";
class Lighting {
    constructor(lights) {
        this.lights = lights;
    }
    static fromLights(lights) {
        return new Lighting(lights);
    }
    // Serializable.
    fromJson(objectAsJson) {
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
    toJson() {
        throw new Error("To be implemented!");
    }
    toObjectSerializable() {
        return this;
    }
    // Helpers.
    static intensityForCollisionAndCamera(collision, camera, sceneRenderer, scene, directionFromObjectToLight, directionFromObjectToLightDotSurfaceNormal, intensityAdjusted) {
        var returnValue = 0;
        if (directionFromObjectToLightDotSurfaceNormal > 0) {
            var objectIsLitByThisLight = false;
            if (sceneRenderer.shadowsAreEnabled) {
                var rayFromObjectToBeLitToLight = Ray.fromStartPosAndDirection(collision.pos, directionFromObjectToLight);
                var collisionsBlockingLight = scene.collisionsOfRayWithObjectsMinusExceptionAddToList(rayFromObjectToBeLitToLight, collision.shapeCollidingFirst(), // objectToExcept
                []);
                objectIsLitByThisLight =
                    (collisionsBlockingLight.length == 0);
            }
            returnValue = Lighting.intensityForCollisionAndCamera_2(objectIsLitByThisLight, camera, collision, directionFromObjectToLight, directionFromObjectToLightDotSurfaceNormal, intensityAdjusted);
        }
        return returnValue;
    }
    static intensityForCollisionAndCamera_2(objectIsLitByThisLight, camera, collision, directionFromObjectToLight, directionFromObjectToLightDotSurfaceNormal, intensityAdjusted) {
        var returnValue = 0;
        if (objectIsLitByThisLight) {
            var material = collision.surfaceMaterial;
            var materialOptics = material.optics;
            var diffuseComponent = materialOptics.diffuse
                * directionFromObjectToLightDotSurfaceNormal
                * intensityAdjusted;
            var surfaceNormal = collision.surfaceNormal;
            var directionOfReflection = this._directionOfReflection
                .overwriteWith(surfaceNormal)
                .multiplyScalar(2 * directionFromObjectToLightDotSurfaceNormal)
                .subtract(directionFromObjectToLight);
            var directionFromObjectToViewer = this._directionFromObjectToViewer
                .overwriteWith(camera.pos)
                .subtract(collision.pos)
                .normalize();
            var specularComponent = materialOptics.specular
                * Math.pow(directionOfReflection.dotProduct(directionFromObjectToViewer), materialOptics.shininess)
                * intensityAdjusted;
            returnValue = diffuseComponent + specularComponent;
        }
        return returnValue;
    }
}
Lighting._directionFromObjectToViewer = Coords.create();
Lighting._directionOfReflection = Coords.create();

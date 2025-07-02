"use strict";
class LightDirectional {
    constructor(intensity, direction) {
        this.typeName = LightDirectional.name;
        this.intensity = intensity;
        this.direction = direction.normalize();
    }
    static fromIntensityAndDirection(intensity, direction) {
        return new LightDirectional(intensity, direction);
    }
    intensityForCollisionAndCamera(collision, camera, sceneRenderer, scene) {
        var returnValue = 0;
        this.temporaryVariablesInitializeIfNecessary();
        var surfaceNormal = collision.surfaceNormal;
        var directionFromObjectToLight = this._directionInverted
            .overwriteWith(this.direction)
            .invert();
        var directionFromObjectToLightDotSurfaceNormal = directionFromObjectToLight
            .dotProduct(surfaceNormal);
        var intensityAdjusted = this.intensity;
        returnValue = Lighting.intensityForCollisionAndCamera(collision, camera, sceneRenderer, scene, directionFromObjectToLight, directionFromObjectToLightDotSurfaceNormal, intensityAdjusted);
        return returnValue;
    }
    temporaryVariablesInitializeIfNecessary() {
        if (this._directionFromObjectToViewer == null) {
            this._directionFromObjectToViewer = Coords.create();
        }
        if (this._directionInverted == null) {
            this._directionInverted = Coords.create();
        }
    }
}

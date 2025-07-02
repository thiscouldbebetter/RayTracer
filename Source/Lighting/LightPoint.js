"use strict";
class LightPoint {
    constructor(intensity, pos) {
        this.typeName = LightPoint.name;
        this.intensity = intensity;
        this.pos = pos;
    }
    static fromIntensityAndPos(intensity, pos) {
        return new LightPoint(intensity, pos);
    }
    intensityForCollisionAndCamera(collision, camera, sceneRenderer, scene) {
        var returnValue = 0;
        this.temporaryVariablesInitializeIfNecessary();
        var displacementFromObjectToLight = this._displacementFromObjectToLight
            .overwriteWith(this.pos)
            .subtract(collision.pos);
        var distanceFromLightToObject = displacementFromObjectToLight.magnitude();
        var distanceFromLightToObjectSquared = Math.pow(distanceFromLightToObject, 2);
        var directionFromObjectToLight = displacementFromObjectToLight.normalize();
        var directionFromObjectToLightDotSurfaceNormal = directionFromObjectToLight
            .dotProduct(collision.surfaceNormal);
        var intensityAdjusted = this.intensity / distanceFromLightToObjectSquared;
        returnValue = Lighting.intensityForCollisionAndCamera(collision, camera, sceneRenderer, scene, directionFromObjectToLight, directionFromObjectToLightDotSurfaceNormal, intensityAdjusted);
        return returnValue;
    }
    temporaryVariablesInitializeIfNecessary() {
        if (this._directionFromObjectToViewer == null) {
            this._directionFromObjectToViewer = Coords.create();
        }
        if (this._displacementFromObjectToLight == null) {
            this._displacementFromObjectToLight = Coords.create();
        }
    }
}

"use strict";
class LightPoint {
    constructor(intensity, pos) {
        this.typeName = LightPoint.name;
        this.intensity = intensity;
        this.pos = pos;
    }
    intensityForCollisionMaterialNormalAndCamera(collision, material, normal, camera, sceneRenderer, scene) {
        this.temporaryVariablesInitializeIfNecessary();
        var displacementFromObjectToLight = this._displacementFromObjectToLight;
        displacementFromObjectToLight.overwriteWith(this.pos).subtract(collision.pos);
        var distanceFromLightToObject = displacementFromObjectToLight.magnitude();
        var distanceFromLightToObjectSquared = Math.pow(distanceFromLightToObject, 2);
        var surfaceNormal = this._surfaceNormal.overwriteWith(normal);
        var directionFromObjectToLight = displacementFromObjectToLight.normalize();
        var directionFromObjectToLightDotSurfaceNormal = directionFromObjectToLight.dotProduct(surfaceNormal);
        var returnValue = 0;
        if (directionFromObjectToLightDotSurfaceNormal > 0) {
            var objectIsLitByThisLight = false;
            if (sceneRenderer.shadowsAreEnabled) {
                var rayFromObjectToBeLitToLight = new Ray(collision.pos, directionFromObjectToLight);
                var collisionsBlockingLight = scene.collisionsOfRayWithObjectsMinusExceptionAddToList(rayFromObjectToBeLitToLight, collision.colliderFirst(), // objectToExcept
                []);
                objectIsLitByThisLight = (collisionsBlockingLight.length == 0);
            }
            if (objectIsLitByThisLight) {
                var diffuseComponent = material.diffuse
                    * directionFromObjectToLightDotSurfaceNormal
                    * this.intensity
                    / distanceFromLightToObjectSquared;
                var directionOfReflection = surfaceNormal.multiplyScalar(2 * directionFromObjectToLightDotSurfaceNormal).subtract(directionFromObjectToLight);
                var directionFromObjectToViewer = this._directionFromObjectToViewer.overwriteWith(camera.pos).subtract(collision.pos).normalize();
                var specularComponent = material.specular
                    * Math.pow(directionOfReflection.dotProduct(directionFromObjectToViewer), material.shininess)
                    * this.intensity
                    / distanceFromLightToObjectSquared;
                returnValue = diffuseComponent + specularComponent;
            }
        }
        return returnValue;
    }
    temporaryVariablesInitializeIfNecessary() {
        if (this._directionFromObjectToViewer == null) {
            this._directionFromObjectToViewer = Coords.create();
        }
        if (this._displacementFromObjectToLight == null) {
            this._displacementFromObjectToLight = Coords.create();
        }
        if (this._surfaceNormal == null) {
            this._surfaceNormal = Coords.create();
        }
    }
}

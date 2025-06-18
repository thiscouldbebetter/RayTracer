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
    intensityForCollisionMaterialNormalAndCamera(collision, material, normal, camera, sceneRenderer, scene) {
        this.temporaryVariablesInitializeIfNecessary();
        var surfaceNormal = this._surfaceNormal.overwriteWith(normal);
        var directionFromObjectToLight = this._directionInverted.overwriteWith(this.direction).invert();
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
                var materialOptics = material.optics;
                var diffuseComponent = materialOptics.diffuse
                    * directionFromObjectToLightDotSurfaceNormal
                    * this.intensity;
                var directionOfReflection = surfaceNormal.multiplyScalar(2 * directionFromObjectToLightDotSurfaceNormal).subtract(directionFromObjectToLight);
                var directionFromObjectToViewer = this._directionFromObjectToViewer
                    .overwriteWith(camera.pos)
                    .subtract(collision.pos)
                    .normalize();
                var specularComponent = materialOptics.specular
                    * Math.pow(directionOfReflection.dotProduct(directionFromObjectToViewer), materialOptics.shininess)
                    * this.intensity;
                returnValue = diffuseComponent + specularComponent;
            }
        }
        return returnValue;
    }
    temporaryVariablesInitializeIfNecessary() {
        if (this._directionFromObjectToViewer == null) {
            this._directionFromObjectToViewer = Coords.create();
        }
        if (this._directionInverted == null) {
            this._directionInverted = Coords.create();
        }
        if (this._surfaceNormal == null) {
            this._surfaceNormal = Coords.create();
        }
    }
}

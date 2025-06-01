"use strict";
class LightAmbient {
    constructor(intensity) {
        this.typeName = LightAmbient.name;
        this.intensity = intensity;
    }
    intensityForCollisionMaterialNormalAndCamera(collision, material, normal, camera, sceneRenderer, scene) {
        return this.intensity;
    }
}

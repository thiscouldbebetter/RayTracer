"use strict";
class LightDirectional {
    constructor(intensity, orientation) {
        this.intensity = intensity;
        this.orientation = orientation;
    }
    intensityForCollisionMaterialNormalAndCamera(collision, material, normal, camera) {
        return 0; // todo
    }
}

"use strict";
class LightAmbient {
    constructor(intensity) {
        this.intensity = intensity;
    }
    intensityForCollisionNormalAndCamera(collision, normal, camera) {
        return this.intensity;
    }
}

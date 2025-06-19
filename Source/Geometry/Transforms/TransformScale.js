"use strict";
class TransformScale {
    constructor(scaleFactors) {
        this.scaleFactors = scaleFactors;
    }
    static fromScaleFactors(scaleFactors) {
        return new TransformScale(scaleFactors);
    }
    transformCoords(coordsToTransform) {
        coordsToTransform.multiply(this.scaleFactors);
        return coordsToTransform;
    }
}

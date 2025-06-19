"use strict";
class TransformOrient {
    constructor(orientation) {
        this.orientation = orientation;
    }
    static fromOrientation(orientation) {
        return new TransformOrient(orientation);
    }
    transformCoords(coordsToTransform) {
        var ori = this.orientation;
        coordsToTransform.overwriteWithXYZ(ori.forward.dotProduct(coordsToTransform), ori.right.dotProduct(coordsToTransform), ori.down.dotProduct(coordsToTransform));
        return coordsToTransform;
    }
}

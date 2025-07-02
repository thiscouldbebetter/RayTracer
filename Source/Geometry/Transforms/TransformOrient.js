"use strict";
class TransformOrient {
    constructor(orientation) {
        this.orientation = orientation;
    }
    static create() {
        return new TransformOrient(Orientation.create());
    }
    static fromOrientation(orientation) {
        return new TransformOrient(orientation);
    }
    orientationSet(value) {
        this.orientation.overwriteWith(value);
        return this;
    }
    transformCoords(coordsToTransform) {
        var ori = this.orientation;
        coordsToTransform.overwriteWithXYZ(ori.forward.dotProduct(coordsToTransform), ori.right.dotProduct(coordsToTransform), ori.down.dotProduct(coordsToTransform));
        return coordsToTransform;
    }
}

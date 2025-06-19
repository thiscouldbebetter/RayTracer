"use strict";
class TransformTranslate {
    constructor(offset) {
        this.offset = offset;
    }
    static fromOffset(offset) {
        return new TransformTranslate(offset);
    }
    transformCoords(coordsToTransform) {
        coordsToTransform.add(this.offset);
        return coordsToTransform;
    }
}

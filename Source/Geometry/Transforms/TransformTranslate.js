"use strict";
class TransformTranslate {
    constructor(offset) {
        this.offset = offset;
    }
    transformCoords(coordsToTransform) {
        coordsToTransform.add(this.offset);
        return coordsToTransform;
    }
}

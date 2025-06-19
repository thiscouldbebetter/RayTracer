"use strict";
class TransformMultiple {
    constructor(children) {
        this.children = children;
    }
    static fromChildren(children) {
        return new TransformMultiple(children);
    }
    transformCoords(coordsToTransform) {
        this.children
            .forEach(x => x.transformCoords(coordsToTransform));
        return coordsToTransform;
    }
}

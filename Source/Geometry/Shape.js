"use strict";
class ShapeBuilder {
    constructor(shapeDefinitionName, pos) {
        this.shapeDefinitionName = shapeDefinitionName;
        this.pos = pos;
    }
    toShape(scene) {
        var shapeDefinition = scene.shapeDefinitionByName(this.shapeDefinitionName);
        var shape = shapeDefinition.clone();
        // todo - Transform.
        return shape;
    }
}
class ShapeHelper {
    static typeSetOnShape(objectToSetTypeOn) {
        return SerializableHelper.typeSetOnObjectFromTypeArray(objectToSetTypeOn, [Mesh, Sphere]);
    }
}

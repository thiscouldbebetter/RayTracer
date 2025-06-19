"use strict";
class ShapeBuilder {
    constructor(shapeDefinitionName, pos) {
        this.shapeDefinitionName = shapeDefinitionName;
        this.pos = pos;
    }
    static fromShapeDefinitionNameAndPos(shapeDefinitionName, pos) {
        return new ShapeBuilder(shapeDefinitionName, pos);
    }
    toShape(scene) {
        var shapeDefinition = scene.shapeDefinitionByName(this.shapeDefinitionName);
        var shape = shapeDefinition.clone();
        // todo - Transform.
        return shape;
    }
}

"use strict";
class ShapeBuilder {
    constructor(name, shapeDefinition, pos) {
        this.shapeDefinitionName = shapeDefinition.name;
        this.pos = pos;
    }
    static fromNameShapeDefinitionAndPos(name, shapeDefinition, pos) {
        return new ShapeBuilder(name, shapeDefinition, pos);
    }
    toShape(scene) {
        var shapeDefinition = scene.shapeDefinitionByName(this.shapeDefinitionName);
        var shape = shapeDefinition.clone();
        shape.name = this.name;
        var transform = new TransformTranslate(this.pos);
        shape.transformApply(transform);
        return shape;
    }
}

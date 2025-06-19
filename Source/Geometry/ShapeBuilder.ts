
class ShapeBuilder
{
	name: string;
	shapeDefinitionName: string;
	pos: Coords;

	constructor(name: string, shapeDefinition: Shape, pos: Coords)
	{
		this.shapeDefinitionName = shapeDefinition.name;
		this.pos = pos;
	}

	static fromNameShapeDefinitionAndPos
	(
		name: string, shapeDefinition: Shape, pos: Coords
	): ShapeBuilder
	{
		return new ShapeBuilder(name, shapeDefinition, pos);
	}

	toShape(scene: Scene): Shape
	{
		var shapeDefinition =
			scene.shapeDefinitionByName(this.shapeDefinitionName);
		var shape = shapeDefinition.clone();
		shape.name = this.name;
		var transform = new TransformTranslate(this.pos);
		shape.transformApply(transform);
		return shape;
	}
}

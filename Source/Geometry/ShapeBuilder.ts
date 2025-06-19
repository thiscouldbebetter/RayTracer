
class ShapeBuilder
{
	shapeDefinitionName: string;
	pos: Coords;

	constructor(shapeDefinitionName: string, pos: Coords)
	{
		this.shapeDefinitionName = shapeDefinitionName;
		this.pos = pos;
	}

	static fromShapeDefinitionNameAndPos
	(
		shapeDefinitionName: string, pos: Coords
	): ShapeBuilder
	{
		return new ShapeBuilder(shapeDefinitionName, pos);
	}

	toShape(scene: Scene): Shape
	{
		var shapeDefinition = scene.shapeDefinitionByName(this.shapeDefinitionName);
		var shape = shapeDefinition.clone();
		// todo - Transform.
		return shape;
	}
}


interface Shape extends Serializable<Shape>
{
	addCollisionsWithRayToList(ray: Ray, listToAddTo: Collision[]): Collision[]
	clone(): Shape;
	name: string;
	surfaceMaterialColorAndNormalForCollision
	(
		scene: Scene, 
		collisionClosest: Collision,
		surfaceMaterial: Material,
		surfaceColor: Color,
		surfaceNormal: Coords
	): Color;
	typeName: string; // hack - For deserialization.
}

class ShapeBuilder
{
	shapeDefinitionName: string;
	pos: Coords;

	constructor(shapeDefinitionName: string, pos: Coords)
	{
		this.shapeDefinitionName = shapeDefinitionName;
		this.pos = pos;
	}

	toShape(scene: Scene): Shape
	{
		var shapeDefinition = scene.shapeDefinitionByName(this.shapeDefinitionName);
		var shape = shapeDefinition.clone();
		// todo - Transform.
		return shape;
	}
}

class ShapeHelper
{
	static typeSetOnShape(objectToSetTypeOn: Shape): Shape
	{
		return SerializableHelper.typeSetOnObjectFromTypeArray(objectToSetTypeOn, [Mesh, Sphere]);
	}

}

interface Shape extends Serializable<Shape>
{
	addCollisionsWithRayToList(ray: Ray, listToAddTo: Collision[]): Collision[]
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

class ShapeHelper
{
	static typeSetOnShape(objectToSetTypeOn: Shape): Shape
	{
		return SerializableHelper.typeSetOnObjectFromTypeArray(objectToSetTypeOn, [Mesh, Sphere]);
	}

}
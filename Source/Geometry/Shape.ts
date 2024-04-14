
interface Shape extends Serializable<Shape>
{
	addCollisionsWithRayToList(ray: Ray, listToAddTo: Collision[]): Collision[]
	typeName: string; // hack - For deserialization.
}

class ShapeHelper
{
	static typeSetOnShape(objectToSetTypeOn: Shape): Shape
	{
		return SerializableHelper.typeSetOnObjectFromTypeArray(objectToSetTypeOn, [Mesh, Sphere]);
	}

}
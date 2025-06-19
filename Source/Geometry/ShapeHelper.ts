
class ShapeHelper
{
	static typeSetOnShape(objectToSetTypeOn: Shape): Shape
	{
		return SerializableHelper.typeSetOnObjectFromTypeArray
		(
			objectToSetTypeOn, [Mesh, Sphere]
		);
	}

}
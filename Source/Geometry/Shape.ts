
interface Shape extends Serializable<Shape>
{
	addCollisionsWithRayToList(ray: Ray, listToAddTo: Collision[]): Collision[]
	clone(): Shape;
	name: string;
	surfaceMaterialColorAndNormalForCollision
	(
		scene: Scene, 
		collision: Collision
	): Color;
	transformApply(transform: Transform): Shape;
	typeName: string; // hack - For deserialization.
}

interface Shape extends Serializable<Shape>
{
	addCollisionsWithRayToGroup
	(
		ray: Ray, listToAddTo: CollisionGroup
	): CollisionGroup;
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
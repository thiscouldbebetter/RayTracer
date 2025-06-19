
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
	transformApply(transform: Transform): Shape;
	typeName: string; // hack - For deserialization.
}
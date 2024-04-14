
interface Light
{
	intensityForCollisionMaterialNormalAndCamera
	(
		collision: Collision,
		material: Material,
		normal: Coords,
		camera: Camera
	): number;
}
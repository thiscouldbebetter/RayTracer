
interface Light
{
	intensityForCollisionMaterialNormalAndCamera
	(
		collision: Collision,
		material: Material,
		normal: Coords,
		camera: Camera,
		sceneRenderer: SceneRenderer
	): number;

	typeName: string;
}
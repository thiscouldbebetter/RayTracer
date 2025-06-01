
interface Light
{
	intensityForCollisionMaterialNormalAndCamera
	(
		collision: Collision,
		material: Material,
		normal: Coords,
		camera: Camera,
		sceneRenderer: SceneRenderer,
		scene: Scene
	): number;

	typeName: string;
}
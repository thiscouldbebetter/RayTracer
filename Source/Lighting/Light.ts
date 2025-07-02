
interface Light
{
	intensityForCollisionAndCamera
	(
		collision: Collision,
		camera: Camera,
		sceneRenderer: SceneRenderer,
		scene: Scene
	): number;

	typeName: string;
}
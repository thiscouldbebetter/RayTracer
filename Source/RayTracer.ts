
class RayTracer
{
	sceneRender(scene: Scene): void
	{
		var sceneRenderer =
			SceneRenderer.maximal(); // todo - Make configurable through UI.

		sceneRenderer.sceneRender(scene);
	}
}

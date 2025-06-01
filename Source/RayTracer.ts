
class RayTracer
{
	sceneRender(scene: Scene): void
	{
		var displaySize = scene.camera.viewSize;

		var displayToRenderToFirst =
			new DisplayGraphics(displaySize);

		var timeBeforeRender = new Date();

		var sceneRenderer =
			SceneRenderer.maximal(); // todo - Make configurable through UI.

		scene.loadForRendererAndSendToCallback
		(
			sceneRenderer,
			(sceneLoaded: Scene) =>
			{
				this.sceneRender_SceneLoaded
				(
					sceneLoaded,
					sceneRenderer,
					displayToRenderToFirst,
					timeBeforeRender
				);
			}
		)
	}

	sceneRender_SceneLoaded
	(
		sceneLoaded: Scene,
		sceneRenderer: SceneRenderer,
		displayToRenderToFirst: Display,
		timeBeforeRender: Date
	): void
	{
		sceneRenderer.drawSceneToDisplay
		(
			sceneLoaded,
			displayToRenderToFirst
		);

		var timeAfterRender = new Date();
		var renderTimeInMilliseconds =
			timeAfterRender.valueOf()
			- timeBeforeRender.valueOf();
		console.log("Scene rendered in " + renderTimeInMilliseconds + " ms.");
	}
}

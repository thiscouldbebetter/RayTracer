
class Globals
{
	static Instance: Globals = new Globals();

	display: Display;
	scene: Scene;

	initialize(scene: Scene): void
	{
		this.scene = scene;

		var displaySize = this.scene.camera.viewSize;
		this.display = new Display();
		this.display.initialize(displaySize);

		this.scene.loadAndSendToCallback
		(
			(sceneLoaded: Scene) => this.display.drawScene(sceneLoaded)
		)

	}
}

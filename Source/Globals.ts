
class Globals
{
	static Instance: Globals = new Globals();

	display: Display;
	scene: Scene;

	initialize(displaySize: Coords, scene: Scene): void
	{
		this.display = new Display();
		this.display.initialize(displaySize);

		this.scene = scene;

		this.scene.loadAndSendToCallback
		(
			(sceneLoaded: Scene) => this.display.drawScene(sceneLoaded)
		)

	}
}

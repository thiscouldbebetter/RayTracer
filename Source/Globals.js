
class Globals
{
	static Instance = new Globals();

	initialize(displaySize, scene)
	{
		this.display = new Display();
		this.display.initialize(displaySize);

		this.scene = scene;

		this.display.drawScene(this.scene);
	}
}

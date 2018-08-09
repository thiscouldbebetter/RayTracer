
function Globals()
{
	// do nothing
}

{
	Globals.Instance = new Globals();

	Globals.prototype.initialize = function(displaySize, scene)
	{
		this.display = new Display();
		this.display.initialize(displaySize);

		this.scene = scene;

		this.display.drawScene(this.scene);
	}
}

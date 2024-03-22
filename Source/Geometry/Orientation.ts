
class Orientation
{
	constructor(forward, down)
	{
		this.forward = new Coords();
		this.right = new Coords();
		this.down = new Coords();

		this.overwriteWithForwardDown(forward, down);
	}

	// instance methods

	clone()
	{
		return new Orientation
		(
			this.forward.clone(), 
			this.down.clone()
		);
	}

	overwriteWithForwardDown(forward, down)
	{
		this.forward.overwriteWith(forward).normalize();
		this.right.overwriteWith(down).crossProduct(this.forward).normalize();
		this.down.overwriteWith(this.forward).crossProduct(this.right).normalize();
	}

	// instances

	static Instances()
	{
		if (Orientation._instances == null)
		{
			Orientation._instances = new Orientation_Instances();
		}
		return Orientation._instances;
	}
}

class Orientation_Instances
{
	constructor()
	{
		this.Camera = new Orientation
		(
			new Coords(1, 0, 0),
			new Coords(0, 0, 1)
		);

		this.ForwardXDownZ = new Orientation
		(
			new Coords(1, 0, 0),
			new Coords(0, 0, 1)
		);

		this.ForwardZDownX = new Orientation
		(
			new Coords(0, 0, 1),
			new Coords(1, 0, 0)
		);
	}
}
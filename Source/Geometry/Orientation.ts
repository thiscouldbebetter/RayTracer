
class Orientation
{
	forward: Coords;
	right: Coords;
	down: Coords;

	constructor(forward: Coords, down: Coords)
	{
		this.forward = Coords.create();
		this.right = Coords.create();
		this.down = Coords.create();

		this.overwriteWithForwardDown(forward, down);
	}

	// instance methods

	clone(): Orientation
	{
		return new Orientation
		(
			this.forward.clone(), 
			this.down.clone()
		);
	}

	overwriteWithForwardDown(forward: Coords, down: Coords): Orientation
	{
		this.forward.overwriteWith(forward).normalize();
		this.right.overwriteWith(down).crossProduct(this.forward).normalize();
		this.down.overwriteWith(this.forward).crossProduct(this.right).normalize();

		return this;
	}

	// instances

	static _instances: Orientation_Instances
	static Instances(): Orientation_Instances
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
	Camera: Orientation;
	ForwardXDownZ: Orientation;
	ForwardZDownX: Orientation;

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

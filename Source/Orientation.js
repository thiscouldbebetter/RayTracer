
function Orientation(forward, down)
{
	this.forward = new Coords();
	this.right = new Coords();
	this.down = new Coords();

	this.overwriteWithForwardDown(forward, down);
}

{
	// instance methods

	Orientation.prototype.clone = function()
	{
		return new Orientation
		(
			this.forward.clone(), 
			this.down.clone()
		);
	}

	Orientation.prototype.overwriteWithForwardDown = function(forward, down)
	{
		this.forward.overwriteWith(forward).normalize();
		this.right.overwriteWith(down).crossProduct(this.forward).normalize();
		this.down.overwriteWith(this.forward).crossProduct(this.right).normalize();
	}

	// instances

	function Orientation_Instances()
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

	Orientation.Instances = new Orientation_Instances();
}


class TransformOrient implements Transform
{
	orientation: Orientation;

	constructor(orientation: Orientation)
	{
		this.orientation = orientation;
	}

	static create(): TransformOrient
	{
		return new TransformOrient(Orientation.create() );
	}

	static fromOrientation(orientation: Orientation): TransformOrient
	{
		return new TransformOrient(orientation);
	}

	orientationSet(value: Orientation): TransformOrient
	{
		this.orientation.overwriteWith(value);
		return this;
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		var ori = this.orientation;
		coordsToTransform.overwriteWithXYZ
		(
			ori.forward.dotProduct(coordsToTransform),
			ori.right.dotProduct(coordsToTransform),
			ori.down.dotProduct(coordsToTransform)
		);

		return coordsToTransform;
	}
}
